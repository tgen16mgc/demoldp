import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contentJs = readFileSync(new URL("../src/content.js", import.meta.url), "utf8");

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("Vietnamese source strings remain unedited", () => {
  [
    "30 NĂM KIÊN ĐỊNH PHỤNG SỰ",
    "LỜI TRI ÂN & CAM KẾT ĐỒNG HÀNH",
    "30 NĂM VỮNG MỘT TÔN CHỈ",
    "NHỮNG CỘT MỐC ĐÁNG NHỚ",
    "A30 CONTEST: VIẾT TIẾP HÀNH TRÌNH TỰ HÀO",
    "VỀ HINO MOTORS VIỆT NAM",
    "CÔNG TY LD TNHH HINO MOTORS VIỆT NAM"
  ].forEach((text) => assert.match(contentJs, new RegExp(escapeRegExp(text))));
});

test("English source strings remain unedited", () => {
  [
    "30 YEARS OF STEADFAST SERVICE",
    "GRATITUDE & COMMITMENT TO ACCOMPANY",
    "30 YEARS, ONE STEADFAST PRINCIPLE",
    "MEMORABLE MILESTONES",
    "A30 CONTEST: CONTINUING A PROUD JOURNEY",
    "ABOUT HINO MOTORS VIETNAM",
    "HINO MOTORS VIETNAM JOINT VENTURE CO., LTD."
  ].forEach((text) => assert.match(contentJs, new RegExp(escapeRegExp(text))));
});
