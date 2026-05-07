import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contentJs = readFileSync(new URL("../src/content.js", import.meta.url), "utf8");

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("Vietnamese source strings remain unedited", () => {
  [
    "30 NĂM BẢO CHỨNG - ĐỒNG HÀNH TRIỆU HÀNH TRÌNH",
    "LỜI TRI ÂN & CAM KẾT ĐỒNG HÀNH",
    "30 NĂM VƯƠN TẦM CHẤT LƯỢNG",
    "Những cột mốc đáng nhớ",
    "A30 CONTEST: TRIỆU HÀNH TRÌNH - TRIỆU CẢM XÚC",
    "VỀ HINO MOTORS VIỆT NAM",
    "CÔNG TY LD TNHH HINO MOTORS VIỆT NAM"
  ].forEach((text) => assert.match(contentJs, new RegExp(escapeRegExp(text))));
});

test("English source strings remain unedited", () => {
  [
    "30 YEARS OF TRUST - ACCOMPANYING MILLIONS OF JOURNEYS",
    "GRATITUDE & COMMITMENT TO ACCOMPANY",
    "30 YEARS ELEVATING QUALITY",
    "Memorable Milestones",
    "A30 CONTEST: MILLIONS OF JOURNEYS - MILLIONS OF EMOTIONS",
    "ABOUT HINO MOTORS VIETNAM",
    "HINO MOTORS VIETNAM JOINT VENTURE CO., LTD."
  ].forEach((text) => assert.match(contentJs, new RegExp(escapeRegExp(text))));
});
