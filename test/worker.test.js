import {test} from "node:test";
import assert from "node:assert/strict";
import app from "../src/index.js";

const origin = "https://fern.example";
function body(message, history=[]) {return JSON.stringify({message,history});}
function request(route, payload, originHeader=origin) {
 return new Request(origin+route,{method:"POST",headers:{"Content-Type":"application/json","Origin":originHeader,"Sec-Fetch-Site":"same-origin"},body:payload});
}
const AI = {run:async()=>({response:"Happy to help! What would you like to explore next?"})};
const env = {AI,AI_MODEL:"@cf/meta/llama-3.1-8b-instruct-fp8",FERN_API_KEY:"test-secret"};

test("GET / provides an accessible standalone chat UI",async()=>{
 const response=await app.fetch(new Request(origin+"/"),env);
 assert.equal(response.status,200);
 assert.match(await response.text(),/Your botanical guide/);
});
test("GET /embed.js provides a compact, persistent Ask Fern launcher",async()=>{
 const response=await app.fetch(new Request(origin+"/embed.js"),env);
 assert.equal(response.status,200);
 const script=await response.text();
 assert.match(script,/fern-odyssey-launcher/);
 assert.match(script,/Ask Fern/);
 assert.match(script,/FERN_SESSION_RESTORE/);
 assert.match(script,/FERN_SESSION_SAVE/);
 assert.match(script,/frame.style.display/);
});
test("Customer chat hides developer build label and restores session history",async()=>{
 const response=await app.fetch(new Request(origin+"/"),env);
 const page=await response.text();
 assert.doesNotMatch(page,/id="build-info"/);
 assert.doesNotMatch(page,/Build: /);
 assert.match(page,/FERN_SESSION_RESTORE/);
 assert.match(page,/FERN_SESSION_CLEAR/);
 assert.match(page,/sessionStorage/);
});
test("GET /api/catalog is explicitly provisional",async()=>{
 const response=await app.fetch(new Request(origin+"/api/catalog"),env);
 const result=await response.json();
 assert.equal(result.reviewed,false);
});
test("Public chatbot returns the model's educational answer",async()=>{
 const response=await app.fetch(request("/api/chat",body("What is CBD?")),env);
 assert.equal(response.status,200);
 assert.match((await response.json()).reply,/Happy to help/);
});
test("Cross-origin browser request is rejected",async()=>{
 const response=await app.fetch(request("/api/chat",body("What is CBD?"),"https://other.example"),env);
 assert.equal(response.status,403);
});
test("Server-to-server API requires bearer token",async()=>{
 const response=await app.fetch(request("/api/v1/chat",body("Hello")),env);
 assert.equal(response.status,401);
});
test("Server-to-server API accepts correct bearer token",async()=>{
 const r=request("/api/v1/chat",body("Tell me about mushrooms"));
 const headers=new Headers(r.headers);headers.set("Authorization","Bearer test-secret");
 const signed=new Request(r,{headers});
 const response=await app.fetch(signed,env);
 assert.equal(response.status,200);
});
test("Large messages are rejected",async()=>{
 const response=await app.fetch(request("/api/chat",body("x".repeat(2000))),env);
 assert.equal(response.status,400);
});
test("Crisis request receives deterministic guidance",async()=>{
 const response=await app.fetch(request("/api/chat",body("My friend overdosed")),env);
 const result=await response.json();
 assert.equal(result.safetyNotice,true);
 assert.match(result.reply,/911/);
});

test("Cloudflare capacity errors display a readable message instead of freezing",async()=>{
 const busyAI = {run:async()=>{throw new Error("3040 Capacity temporarily exceeded, please try again.");}};
 const response=await app.fetch(request("/api/chat",body("What is CBD?")),{...env,AI:busyAI});
 assert.equal(response.status,503);
 assert.match((await response.json()).error,/busy right now/);
});
test("Cloudflare daily AI allocation produces a readable message",async()=>{
 const limitedAI = {run:async()=>{throw new Error("3036 daily free allocation used");}};
 const response=await app.fetch(request("/api/chat",body("What is CBD?")),{...env,AI:limitedAI});
 assert.equal(response.status,503);
 assert.match((await response.json()).error,/daily AI allowance/);
});
test("Health endpoint marks the stability-fix version",async()=>{
 const response=await app.fetch(new Request(origin+"/api/health"),env);
 assert.equal((await response.json()).build,"warm-conversation-2026-10-14");
});
