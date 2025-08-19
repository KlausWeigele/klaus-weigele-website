"use client";

// src/app/demos/grafik/sdf-raymarching/Raymarcher.tsx
// ChatGPT5 Complete Implementation: Procedural 3D Worlds with SDF Raymarching
// Features: 3 Presets, Cinematic Lighting, Orbit Controls, Quality Scaling, ACES Tonemapping

import { useRef, useEffect, useState, useCallback } from "react";

type Preset = "city" | "chip" | "sculpt";
type Quality = 1 | 2 | 3 | 4 | 5;

interface RaymarcherState {
  preset: Preset;
  quality: Quality;
  paused: boolean;
  showControls: boolean;
  timeOfDay: number; // 0-1 (0=night, 0.5=noon, 1=sunset)
  camera: {
    theta: number;
    phi: number;
    radius: number;
    target: [number, number, number];
  };
  performance: {
    fps: number;
    frameTime: number;
  };
}

// Complete Fragment Shader with all 3 presets and cinematic lighting
const fragmentShader = `
#ifdef GL_ES
precision highp float;
#endif

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform int iPreset; // 0=City, 1=Chip, 2=Sculpt
uniform int iQuality; // 1-5 quality levels
uniform float iTimeOfDay; // 0-1
uniform vec3 iCameraPos;
uniform vec3 iCameraTarget;
varying vec2 vUv;

// Quality settings based on level
#define MAX_STEPS_Q1 32
#define MAX_STEPS_Q2 64
#define MAX_STEPS_Q3 128
#define MAX_STEPS_Q4 256
#define MAX_STEPS_Q5 512

#define MAX_DIST 100.0
#define SURF_DIST 0.001
#define PI 3.14159265359
#define TAU 6.28318530718

// Hash functions for noise
float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 hash31(float p) {
    vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}

// Simplex noise
float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(
        mix(mix(hash11(n + 0.0), hash11(n + 1.0), f.x),
            mix(hash11(n + 57.0), hash11(n + 58.0), f.x), f.y),
        mix(mix(hash11(n + 113.0), hash11(n + 114.0), f.x),
            mix(hash11(n + 170.0), hash11(n + 171.0), f.x), f.y), f.z);
}

// FBM (Fractal Brownian Motion)
float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < octaves; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
        if(i >= 4) break;
    }
    return value;
}

// === SDF PRIMITIVES ===

float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float sdCylinder(vec3 p, float h, float r) {
    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float sdCone(vec3 p, vec2 c, float h) {
    float q = length(p.xz);
    return max(dot(c.xy, vec2(q, p.y)), -h - p.y);
}

// === BOOLEAN OPERATIONS ===

float opUnion(float d1, float d2) {
    return min(d1, d2);
}

float opSubtraction(float d1, float d2) {
    return max(-d1, d2);
}

float opIntersection(float d1, float d2) {
    return max(d1, d2);
}

float opSmoothUnion(float d1, float d2, float k) {
    float h = max(k - abs(d1 - d2), 0.0);
    return min(d1, d2) - h * h * 0.25 / k;
}

float opSmoothSubtraction(float d1, float d2, float k) {
    float h = max(k - abs(-d1 - d2), 0.0);
    return max(-d1, d2) + h * h * 0.25 / k;
}

// === DOMAIN OPERATIONS ===

vec3 opRep(vec3 p, vec3 c) {
    return mod(p + 0.5 * c, c) - 0.5 * c;
}

vec3 opRepLim(vec3 p, float c, vec3 l) {
    return p - c * clamp(round(p / c), -l, l);
}

// === ROTATION MATRICES ===

mat3 rotateX(float a) {
    float c = cos(a); float s = sin(a);
    return mat3(1, 0, 0, 0, c, -s, 0, s, c);
}

mat3 rotateY(float a) {
    float c = cos(a); float s = sin(a);
    return mat3(c, 0, s, 0, 1, 0, -s, 0, c);
}

mat3 rotateZ(float a) {
    float c = cos(a); float s = sin(a);
    return mat3(c, -s, 0, s, c, 0, 0, 0, 1);
}

// === SCENE DEFINITIONS ===

// PRESET 1: City Blocks
float mapCity(vec3 pos) {
    vec3 p = pos;
    
    // Ground plane with displacement
    float ground = p.y + 1.0 + 0.3 * fbm(p, 3);
    
    // City grid repetition
    vec3 gridPos = p;
    vec2 gridId = floor((gridPos.xz + 4.0) / 8.0);
    gridPos.xz = mod(gridPos.xz + 4.0, 8.0) - 4.0;
    
    // Building height variation
    float buildingHeight = 3.0 + 12.0 * hash21(gridId);
    float buildingWidth = 1.2 + 0.8 * hash21(gridId + 10.0);
    
    // Main building structure
    vec3 buildingPos = gridPos - vec3(0, buildingHeight * 0.5, 0);
    float building = sdRoundBox(buildingPos, vec3(buildingWidth, buildingHeight * 0.5, buildingWidth), 0.1);
    
    // Add architectural details
    if (buildingHeight > 8.0) {
        // Antenna on tall buildings
        vec3 antennaPos = gridPos - vec3(0, buildingHeight + 1.5, 0);
        float antenna = sdCylinder(antennaPos, 1.5, 0.08);
        building = opUnion(building, antenna);
        
        // Building crown/setback
        vec3 crownPos = gridPos - vec3(0, buildingHeight * 0.8, 0);
        float crown = sdRoundBox(crownPos, vec3(buildingWidth * 0.8, buildingHeight * 0.2, buildingWidth * 0.8), 0.05);
        building = opSmoothUnion(building, crown, 0.3);
    }
    
    // Window cuts (procedural)
    float windowNoise = hash21(gridId + 20.0);
    if (windowNoise > 0.3) {
        for(int i = 0; i < 6; i++) {
            if (i >= int(buildingHeight / 2.0)) break;
            float yLevel = -buildingHeight * 0.4 + float(i) * (buildingHeight * 0.8 / 6.0);
            
            // Front windows
            vec3 windowPos = gridPos + vec3(0, yLevel, buildingWidth + 0.05);
            float windows = sdBox(windowPos, vec3(buildingWidth * 0.6, 0.4, 0.1));
            building = opSubtraction(windows, building);
            
            // Side windows
            windowPos = gridPos + vec3(buildingWidth + 0.05, yLevel, 0);
            windows = sdBox(windowPos, vec3(0.1, 0.4, buildingWidth * 0.6));
            building = opSubtraction(windows, building);
        }
    }
    
    // Combine with ground
    float scene = opUnion(ground, building);
    
    // Central Klaus Weigele monument
    if (length(p.xz) < 15.0) {
        vec3 monumentPos = p;
        float monument = sdCylinder(monumentPos - vec3(0, 8, 0), 8.0, 1.5);
        
        // KLAUS WEIGELE text cut-outs (simplified geometric representation)
        vec3 textPos = monumentPos - vec3(0, 4, 1.6);
        
        // K shape
        float letterK = opUnion(
            sdBox(textPos + vec3(-2.0, 0, 0), vec3(0.15, 2.0, 0.2)),
            sdBox(textPos + vec3(-1.5, 0.8, 0), vec3(0.6, 0.15, 0.2))
        );
        letterK = opUnion(letterK, sdBox(textPos + vec3(-1.5, -0.8, 0), vec3(0.6, 0.15, 0.2)));
        
        // WEIGELE (simplified as bars)
        float weigele = sdBox(textPos + vec3(0.5, 0, 0), vec3(2.0, 0.3, 0.2));
        
        float letters = opUnion(letterK, weigele);
        monument = opSmoothSubtraction(letters, monument, 0.1);
        
        // Monument base
        float base = sdCylinder(monumentPos - vec3(0, 0.5, 0), 0.5, 2.5);
        monument = opUnion(monument, base);
        
        scene = opSmoothUnion(scene, monument, 1.0);
    }
    
    return scene;
}

// PRESET 2: Chip Microstructure
float mapChip(vec3 pos) {
    vec3 p = pos;
    
    // Base substrate
    float substrate = sdBox(p - vec3(0, -0.5, 0), vec3(20, 0.5, 20));
    
    // Circuit trace patterns
    vec3 tracePos = p;
    tracePos.y -= 0.1;
    
    // Main circuit board pattern
    float traces = 1e6;
    
    // Horizontal traces
    for(int i = -10; i <= 10; i++) {
        float z = float(i) * 0.8;
        vec3 hTracePos = tracePos - vec3(0, 0, z);
        float hTrace = sdBox(hTracePos, vec3(15, 0.02, 0.05));
        traces = opUnion(traces, hTrace);
        
        // Via holes
        for(int j = -8; j <= 8; j += 4) {
            float x = float(j) * 1.2;
            vec3 viaPos = tracePos - vec3(x, 0, z);
            float via = sdCylinder(viaPos, 0.1, 0.08);
            traces = opUnion(traces, via);
        }
    }
    
    // Vertical traces
    for(int i = -8; i <= 8; i += 2) {
        float x = float(i) * 1.2;
        vec3 vTracePos = tracePos - vec3(x, 0, 0);
        float vTrace = sdBox(vTracePos, vec3(0.05, 0.02, 12));
        traces = opUnion(traces, vTrace);
    }
    
    // Processor die areas
    vec3 die1Pos = p - vec3(-6, 0.3, -6);
    float die1 = sdRoundBox(die1Pos, vec3(2, 0.3, 2), 0.1);
    
    vec3 die2Pos = p - vec3(6, 0.3, 6);
    float die2 = sdRoundBox(die2Pos, vec3(1.5, 0.3, 1.5), 0.1);
    
    // Add pin grid array
    vec3 pinPos = p - vec3(-6, 0.5, -6);
    float pins = 1e6;
    for(int i = -3; i <= 3; i++) {
        for(int j = -3; j <= 3; j++) {
            vec3 pinOffset = pinPos + vec3(float(i) * 0.4, 0, float(j) * 0.4);
            float pin = sdCylinder(pinOffset, 0.2, 0.03);
            pins = opUnion(pins, pin);
        }
    }
    
    // Capacitors and resistors
    vec3 capPos = p - vec3(0, 0.2, 8);
    float capacitors = 1e6;
    for(int i = -4; i <= 4; i += 2) {
        vec3 cPos = capPos + vec3(float(i) * 1.5, 0, 0);
        float cap = sdBox(cPos, vec3(0.3, 0.2, 0.6));
        capacitors = opUnion(capacitors, cap);
    }
    
    // Combine all elements
    float scene = opUnion(substrate, traces);
    scene = opUnion(scene, die1);
    scene = opUnion(scene, die2);
    scene = opUnion(scene, pins);
    scene = opUnion(scene, capacitors);
    
    // Add surface detail with noise
    float detail = 0.01 * fbm(p * 20.0, 3);
    scene += detail;
    
    return scene;
}

// PRESET 3: Minimal Sculpt
float mapSculpt(vec3 pos) {
    vec3 p = pos;
    
    // Base pedestal
    float base = sdCylinder(p - vec3(0, -1.5, 0), 1.0, 2.0);
    
    // Main sculptural form - twisted torus
    vec3 sculptPos = p - vec3(0, 2, 0);
    sculptPos *= rotateY(iTime * 0.3) * rotateX(iTime * 0.2);
    
    float sculpture = sdTorus(sculptPos, vec2(2.5, 0.8));
    
    // Add organic deformation
    float deform = 0.3 * sin(sculptPos.x * 2.0 + iTime) * 
                   sin(sculptPos.y * 2.0 + iTime * 1.3) * 
                   sin(sculptPos.z * 2.0 + iTime * 0.7);
    sculpture += deform;
    
    // Secondary sculptural elements
    vec3 sphere1Pos = p - vec3(3.5 * cos(iTime * 0.5), 1.5 + sin(iTime * 0.8), 3.5 * sin(iTime * 0.5));
    float sphere1 = sdSphere(sphere1Pos, 0.8);
    
    vec3 sphere2Pos = p - vec3(-2.8 * cos(iTime * 0.7 + PI), 2.8 + 0.5 * sin(iTime * 1.2), -2.8 * sin(iTime * 0.7 + PI));
    float sphere2 = sdSphere(sphere2Pos, 0.6);
    
    // Floating cubes
    vec3 cube1Pos = p - vec3(0, 5.5 + 0.8 * sin(iTime * 1.5), 0);
    cube1Pos *= rotateY(iTime * 0.8) * rotateZ(iTime * 0.6);
    float cube1 = sdRoundBox(cube1Pos, vec3(0.8), 0.2);
    
    // Connect elements with smooth unions
    float scene = opSmoothUnion(base, sculpture, 0.5);
    scene = opSmoothUnion(scene, sphere1, 0.8);
    scene = opSmoothUnion(scene, sphere2, 0.6);
    scene = opSmoothUnion(scene, cube1, 0.4);
    
    // Ground plane
    float ground = p.y + 3.0;
    scene = opSmoothUnion(scene, ground, 1.0);
    
    return scene;
}

// Main scene mapping function
float map(vec3 pos) {
    if (iPreset == 0) return mapCity(pos);
    if (iPreset == 1) return mapChip(pos);
    return mapSculpt(pos);
}

// Raymarching function with quality-adaptive steps
float raymarch(vec3 ro, vec3 rd) {
    float dO = 0.0;
    int maxSteps = MAX_STEPS_Q1;
    
    if (iQuality == 2) maxSteps = MAX_STEPS_Q2;
    else if (iQuality == 3) maxSteps = MAX_STEPS_Q3;
    else if (iQuality == 4) maxSteps = MAX_STEPS_Q4;
    else if (iQuality == 5) maxSteps = MAX_STEPS_Q5;
    
    for(int i = 0; i < maxSteps; i++) {
        if (i >= maxSteps) break;
        
        vec3 p = ro + rd * dO;
        float dS = map(p);
        dO += dS;
        
        if(dO > MAX_DIST || abs(dS) < SURF_DIST) break;
    }
    
    return dO;
}

// Calculate surface normal
vec3 getNormal(vec3 p) {
    float d = map(p);
    vec2 e = vec2(0.001, 0);
    
    vec3 n = d - vec3(
        map(p - e.xyy),
        map(p - e.yxy),
        map(p - e.yyx)
    );
    
    return normalize(n);
}

// Soft shadows with quality scaling
float getSoftShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
    float res = 1.0;
    float t = mint;
    int samples = 8;
    if (iQuality >= 3) samples = 16;
    if (iQuality >= 4) samples = 24;
    
    for(int i = 0; i < samples; i++) {
        if (i >= samples) break;
        
        float h = map(ro + rd * t);
        if(h < 0.001) return 0.0;
        res = min(res, k * h / t);
        t += clamp(h, 0.01, 0.2);
        if(t > maxt) break;
    }
    return clamp(res, 0.0, 1.0);
}

// Ambient Occlusion with quality scaling
float getAO(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    int samples = 3;
    if (iQuality >= 3) samples = 5;
    if (iQuality >= 4) samples = 8;
    
    for(int i = 0; i < samples; i++) {
        if (i >= samples) break;
        
        float h = 0.01 + 0.12 * float(i) / float(samples - 1);
        float d = map(p + h * n);
        occ += (h - d) * sca;
        sca *= 0.95;
        if(occ > 0.35) break;
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0) * (0.5 + 0.5 * n.y);
}

// ACES Tonemapping
vec3 ACESFilm(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}

// Time-of-day lighting calculation
vec3 getTimeOfDayLighting() {
    float tod = iTimeOfDay;
    
    // Sun direction based on time of day
    float sunAngle = (tod - 0.25) * TAU; // 0.25 = noon at top
    vec3 sunDir = normalize(vec3(cos(sunAngle) * 0.8, sin(sunAngle), 0.3));
    
    // Sun color temperature based on time
    vec3 sunColor;
    if (tod < 0.2 || tod > 0.8) {
        // Night/twilight - cooler, dimmer
        sunColor = vec3(0.2, 0.3, 0.6) * 0.1;
    } else if (tod < 0.4 || tod > 0.6) {
        // Golden hour - warm
        sunColor = mix(vec3(1.0, 0.7, 0.4), vec3(1.0, 0.9, 0.8), abs(tod - 0.5) * 4.0);
    } else {
        // Midday - bright white
        sunColor = vec3(1.0, 0.95, 0.9);
    }
    
    return sunColor * (0.5 + 1.5 * clamp(sunDir.y, 0.0, 1.0));
}

vec3 getSkyColor(vec3 rd) {
    float tod = iTimeOfDay;
    
    // Horizon color based on time of day
    vec3 horizonColor;
    vec3 zenithColor;
    
    if (tod < 0.2 || tod > 0.8) {
        // Night
        horizonColor = vec3(0.05, 0.1, 0.2);
        zenithColor = vec3(0.01, 0.02, 0.08);
    } else if (tod < 0.4 || tod > 0.6) {
        // Golden hour
        horizonColor = vec3(1.0, 0.6, 0.2);
        zenithColor = vec3(0.3, 0.5, 0.8);
    } else {
        // Day
        horizonColor = vec3(0.8, 0.9, 1.0);
        zenithColor = vec3(0.2, 0.5, 1.0);
    }
    
    float horizonFactor = exp(-max(rd.y * 8.0, 0.0));
    return mix(zenithColor, horizonColor, horizonFactor);
}

// Main rendering function
vec3 render(vec2 uv) {
    // Use camera uniforms from JavaScript
    vec3 ro = iCameraPos;
    vec3 ta = iCameraTarget;
    
    // Camera matrix
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0, 1, 0)));
    vec3 vv = normalize(cross(uu, ww));
    
    // Create ray direction
    vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.5 * ww);
    
    // Sky color
    vec3 col = getSkyColor(rd);
    
    // Raymarching
    float t = raymarch(ro, rd);
    
    if(t < MAX_DIST) {
        vec3 pos = ro + t * rd;
        vec3 nor = getNormal(pos);
        
        // Material properties based on preset
        vec3 albedo = vec3(0.7);
        float roughness = 0.5;
        float metallic = 0.0;
        
        if (iPreset == 0) { // City
            if(pos.y < 0.0) {
                albedo = vec3(0.3, 0.3, 0.35); // Ground
                roughness = 0.8;
            } else if(length(pos.xz) < 3.0) {
                albedo = vec3(0.8, 0.7, 0.5); // Monument
                roughness = 0.3;
            } else {
                albedo = vec3(0.6, 0.65, 0.7); // Buildings
                roughness = 0.4;
            }
        } else if (iPreset == 1) { // Chip
            if(pos.y < 0.05) {
                albedo = vec3(0.1, 0.3, 0.1); // PCB green
                roughness = 0.6;
                metallic = 0.1;
            } else {
                albedo = vec3(0.8, 0.8, 0.9); // Silicon/metal
                roughness = 0.2;
                metallic = 0.7;
            }
        } else { // Sculpt
            float colorNoise = fbm(pos * 2.0, 3);
            albedo = mix(vec3(0.9, 0.8, 0.7), vec3(0.7, 0.9, 0.8), colorNoise);
            roughness = 0.3;
            metallic = 0.1;
        }
        
        // Lighting setup
        vec3 sunColor = getTimeOfDayLighting();
        float sunAngle = (iTimeOfDay - 0.25) * TAU;
        vec3 sunDir = normalize(vec3(cos(sunAngle) * 0.8, sin(sunAngle), 0.3));
        
        // Direct lighting
        float NdotL = clamp(dot(nor, sunDir), 0.0, 1.0);
        float shadow = 1.0;
        if (iQuality >= 2) {
            shadow = getSoftShadow(pos + nor * 0.01, sunDir, 0.02, 10.0, 16.0);
        }
        
        vec3 directLight = sunColor * NdotL * shadow;
        
        // Indirect lighting
        vec3 skyColor = getSkyColor(nor);
        float skyDiffuse = clamp(0.5 + 0.5 * nor.y, 0.0, 1.0);
        vec3 indirectLight = skyColor * skyDiffuse * 0.3;
        
        // Ground bounce
        float groundDiffuse = clamp(-nor.y, 0.0, 1.0);
        vec3 groundBounce = vec3(0.2, 0.15, 0.1) * groundDiffuse * 0.2;
        
        // Fresnel and specular (simplified)
        vec3 viewDir = -rd;
        vec3 reflectDir = reflect(-sunDir, nor);
        float spec = pow(clamp(dot(viewDir, reflectDir), 0.0, 1.0), 32.0 / roughness);
        vec3 specular = sunColor * spec * shadow * (1.0 - roughness);
        
        // Combine lighting
        vec3 diffuse = albedo * (directLight + indirectLight + groundBounce);
        col = diffuse + specular * mix(albedo, vec3(1.0), metallic);
        
        // Ambient occlusion
        if (iQuality >= 2) {
            float ao = getAO(pos, nor);
            col *= ao;
        }
        
        // Atmospheric perspective
        col = mix(col, getSkyColor(rd), 1.0 - exp(-0.0001 * t * t));
    }
    
    // ACES tonemapping and gamma correction
    col = ACESFilm(col);
    col = pow(col, vec3(1.0 / 2.2));
    
    return col;
}

void main() {
    // Screen coordinates
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= iResolution.x / iResolution.y;
    
    // Anti-aliasing for higher quality
    vec3 col = vec3(0.0);
    if (iQuality >= 4) {
        // 4x MSAA
        float sampleOffset = 0.5 / max(iResolution.x, iResolution.y);
        col += render(uv + vec2(-sampleOffset, -sampleOffset)) * 0.25;
        col += render(uv + vec2( sampleOffset, -sampleOffset)) * 0.25;
        col += render(uv + vec2(-sampleOffset,  sampleOffset)) * 0.25;
        col += render(uv + vec2( sampleOffset,  sampleOffset)) * 0.25;
    } else {
        col = render(uv);
    }
    
    gl_FragColor = vec4(col, 1.0);
}
`;

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;

void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

export default function Raymarcher() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  
  const [state, setState] = useState<RaymarcherState>({
    preset: "city",
    quality: 3,
    paused: false,
    showControls: false,
    timeOfDay: 0.5, // Noon
    camera: {
      theta: 0,
      phi: Math.PI * 0.3,
      radius: 20,
      target: [0, 0, 0]
    },
    performance: {
      fps: 60,
      frameTime: 16.67
    }
  });

  // Performance monitoring
  const lastFrameTimeRef = useRef(Date.now());
  const frameTimesRef = useRef<number[]>([]);

  // Mouse interaction state
  const mouseRef = useRef({
    isDown: false,
    lastX: 0,
    lastY: 0,
    moveX: 0,
    moveY: 0
  });

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false
    });

    if (!gl) {
      console.error('WebGL2 not supported');
      return false;
    }

    glRef.current = gl;

    // Create shader program
    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    
    if (!vertShader || !fragShader) return false;

    const program = createProgram(gl, vertShader, fragShader);
    if (!program) return false;

    programRef.current = program;

    // Create fullscreen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    return true;
  }, []);

  // Create shader helper
  const createShader = (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  // Create program helper
  const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  // Camera position calculation
  const calculateCameraPosition = useCallback(() => {
    const { theta, phi, radius, target } = state.camera;
    const x = target[0] + radius * Math.sin(phi) * Math.cos(theta);
    const y = target[1] + radius * Math.cos(phi);
    const z = target[2] + radius * Math.sin(phi) * Math.sin(theta);
    return [x, y, z];
  }, [state.camera]);

  // Render frame
  const renderFrame = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas || state.paused) return;

    // Update canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, state.quality >= 4 ? 2 : 1.5);
    const width = Math.floor(rect.width * dpr);
    const height = Math.floor(rect.height * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    // Performance monitoring
    const now = Date.now();
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    frameTimesRef.current.push(frameTime);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
    const fps = 1000 / avgFrameTime;

    setState(prev => ({
      ...prev,
      performance: { fps, frameTime: avgFrameTime }
    }));

    // Update uniforms
    const time = (now - startTimeRef.current) / 1000;
    const cameraPos = calculateCameraPosition();

    gl.useProgram(program);

    // Set uniforms
    const timeLocation = gl.getUniformLocation(program, 'iTime');
    gl.uniform1f(timeLocation, time);

    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    gl.uniform2f(resolutionLocation, width, height);

    const mouseLocation = gl.getUniformLocation(program, 'iMouse');
    gl.uniform2f(mouseLocation, mouseRef.current.moveX, mouseRef.current.moveY);

    const presetLocation = gl.getUniformLocation(program, 'iPreset');
    const presetMap = { city: 0, chip: 1, sculpt: 2 };
    gl.uniform1i(presetLocation, presetMap[state.preset]);

    const qualityLocation = gl.getUniformLocation(program, 'iQuality');
    gl.uniform1i(qualityLocation, state.quality);

    const timeOfDayLocation = gl.getUniformLocation(program, 'iTimeOfDay');
    gl.uniform1f(timeOfDayLocation, state.timeOfDay);

    const cameraPosLocation = gl.getUniformLocation(program, 'iCameraPos');
    gl.uniform3f(cameraPosLocation, cameraPos[0], cameraPos[1], cameraPos[2]);

    const cameraTargetLocation = gl.getUniformLocation(program, 'iCameraTarget');
    gl.uniform3f(cameraTargetLocation, state.camera.target[0], state.camera.target[1], state.camera.target[2]);

    // Clear and draw
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  }, [state, calculateCameraPosition]);

  // Animation loop
  const animate = useCallback(() => {
    renderFrame();
    animationIdRef.current = requestAnimationFrame(animate);
  }, [renderFrame]);

  // Mouse controls
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const mouse = mouseRef.current;
    
    if (mouse.isDown) {
      const deltaX = e.clientX - mouse.lastX;
      const deltaY = e.clientY - mouse.lastY;

      setState(prev => ({
        ...prev,
        camera: {
          ...prev.camera,
          theta: prev.camera.theta - deltaX * 0.01,
          phi: Math.max(0.1, Math.min(Math.PI - 0.1, prev.camera.phi + deltaY * 0.01))
        }
      }));

      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
    }

    // Update mouse coordinates for shader
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouse.moveX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.moveY = (1 - (e.clientY - rect.top) / rect.height) * 2 - 1;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY * 0.01;
    setState(prev => ({
      ...prev,
      camera: {
        ...prev.camera,
        radius: Math.max(5, Math.min(50, prev.camera.radius + delta))
      }
    }));
    e.preventDefault();
  }, []);

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case ' ':
        e.preventDefault();
        setState(prev => ({ ...prev, paused: !prev.paused }));
        break;
      case '1':
        setState(prev => ({ ...prev, preset: 'city' }));
        break;
      case '2':
        setState(prev => ({ ...prev, preset: 'chip' }));
        break;
      case '3':
        setState(prev => ({ ...prev, preset: 'sculpt' }));
        break;
      case 'h':
      case 'H':
        e.preventDefault();
        setState(prev => ({ ...prev, showControls: !prev.showControls }));
        break;
      case 'q':
        setState(prev => ({ ...prev, quality: Math.max(1, prev.quality - 1) as Quality }));
        break;
      case 'a':
        setState(prev => ({ ...prev, quality: Math.min(5, prev.quality + 1) as Quality }));
        break;
    }
  }, []);

  // Initialize
  useEffect(() => {
    if (initWebGL()) {
      animate();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [animate, handleKeyDown, initWebGL]);

  // Auto-rotate time of day
  useEffect(() => {
    if (state.paused) return;

    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        timeOfDay: (prev.timeOfDay + 0.005) % 1.0
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [state.paused]);

  const presetNames = {
    city: 'City Blocks',
    chip: 'Chip Microstructure',
    sculpt: 'Minimal Sculpt'
  };

  const qualityNames = {
    1: 'Mobile',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Ultra'
  };

  return (
    <div className="relative w-full aspect-[16/9] bg-black rounded-2xl overflow-hidden">
      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ touchAction: 'none' }}
      />

      {/* Status Indicator */}
      <div className="absolute top-3 right-3 text-xs px-3 py-1 bg-black/70 backdrop-blur text-white rounded-lg">
        {presetNames[state.preset]} · Q{state.quality}
        {state.paused && ' · PAUSED'}
        <div className="text-[10px] text-gray-300 mt-1">
          {Math.round(state.performance.fps)}fps · {state.performance.frameTime.toFixed(1)}ms
        </div>
      </div>

      {/* Controls Panel */}
      {state.showControls && (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 text-white min-w-[300px] max-w-[400px]">
          <h3 className="text-sm font-semibold mb-3 text-blue-300">SDF Raymarching Controls</h3>
          
          <div className="space-y-4">
            {/* Preset Selection */}
            <div>
              <label className="text-xs text-gray-300 block mb-2">World Preset:</label>
              <div className="grid grid-cols-1 gap-2">
                {(['city', 'chip', 'sculpt'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setState(prev => ({ ...prev, preset }))}
                    className={`px-3 py-2 text-sm rounded transition-colors text-left ${
                      state.preset === preset 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-medium">{presetNames[preset]}</div>
                    <div className="text-xs text-gray-300 mt-1">
                      {preset === 'city' && 'Urban landscape with procedural buildings'}
                      {preset === 'chip' && 'Silicon wafer with circuit patterns'}
                      {preset === 'sculpt' && 'Abstract geometric art installation'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Settings */}
            <div>
              <label className="text-xs text-gray-300 block mb-2">Quality Level:</label>
              <div className="flex gap-1">
                {([1, 2, 3, 4, 5] as const).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setState(prev => ({ ...prev, quality }))}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      state.quality === quality 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    Q{quality}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Current: {qualityNames[state.quality]} ({state.quality === 1 ? '32' : state.quality === 2 ? '64' : state.quality === 3 ? '128' : state.quality === 4 ? '256' : '512'} steps)
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <label className="text-xs text-gray-300 block mb-2">Time of Day:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.timeOfDay}
                onChange={(e) => setState(prev => ({ ...prev, timeOfDay: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-400 mt-1">
                {state.timeOfDay < 0.2 ? 'Night' : 
                 state.timeOfDay < 0.4 ? 'Dawn' : 
                 state.timeOfDay < 0.6 ? 'Day' : 
                 state.timeOfDay < 0.8 ? 'Dusk' : 'Night'}
              </div>
            </div>

            {/* Camera Reset */}
            <button
              onClick={() => setState(prev => ({ 
                ...prev, 
                camera: { theta: 0, phi: Math.PI * 0.3, radius: 20, target: [0, 0, 0] }
              }))}
              className="w-full px-3 py-2 bg-purple-600/70 hover:bg-purple-600 rounded transition-colors text-sm"
            >
              🎥 Reset Camera
            </button>

            {/* Pause Toggle */}
            <button
              onClick={() => setState(prev => ({ ...prev, paused: !prev.paused }))}
              className="w-full px-3 py-2 bg-blue-600/70 hover:bg-blue-600 rounded transition-colors text-sm"
            >
              {state.paused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20 text-xs text-gray-400 space-y-1">
            <div>🖱️ Drag: Orbit camera</div>
            <div>🔍 Wheel: Zoom in/out</div>
            <div>⌨️ 1-3: Switch presets</div>
            <div>⌨️ Q/A: Quality down/up</div>
            <div>⌨️ Space: Pause/Resume</div>
            <div>⌨️ H: Toggle controls</div>
          </div>
        </div>
      )}

      {/* Help Hint */}
      {!state.showControls && (
        <div className="absolute bottom-4 left-4 text-xs text-white/70">
          Press <kbd className="bg-white/20 px-1 rounded">H</kbd> for controls
        </div>
      )}

      {/* Quality/Performance Info */}
      <div className="absolute bottom-4 right-4 text-xs text-white/70">
        {qualityNames[state.quality]} Quality
      </div>

      {/* Loading State */}
      {!glRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm">Compiling SDF Raymarcher...</p>
            <p className="text-xs text-gray-400 mt-2">WebGL2 Fragment Shaders</p>
          </div>
        </div>
      )}
    </div>
  );
}