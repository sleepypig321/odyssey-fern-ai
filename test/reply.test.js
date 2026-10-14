import { test } from "node:test";
import assert from "node:assert/strict";
import {finishReply} from "../src/reply.js";

test("short replies remain unchanged",()=>{const s="Good question! How can I help?";assert.equal(finishReply(s),s);});
test("incomplete tail is removed",()=>{assert.equal(finishReply("Kratom colors are labels. Are you"),"Kratom colors are labels.");});
