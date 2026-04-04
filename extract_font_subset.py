#!/usr/bin/env python3
"""
提取五笔字根字体子集 - 根据用户微调后的映射
"""

from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter
import os

# 所有需要的PUA字符（根据用户修改后的映射）
all_codepoints = [
    # Q: E200-E20C
    *range(0xE200, 0xE20D),
    # W: E212-E216
    *range(0xE212, 0xE217),
    # E: E21C, E21E-E224, E226-E227, E22A, E22E-E22F
    0xE21C, 0xE21E, 0xE21F, 0xE220, 0xE221, 0xE222, 0xE223, 0xE224,
    0xE226, 0xE227, 0xE22A, 0xE22E, 0xE22F,
    # R: E230-E238
    *range(0xE230, 0xE239),
    # T: E240-E249
    *range(0xE240, 0xE24A),
    # Y: E250-E258
    *range(0xE250, 0xE259),
    # U: E260, E25B-E25D, E25F-E269 (去掉E25E)
    0xE260, 0xE25B, 0xE25C, 0xE25D, *range(0xE25F, 0xE26A),
    # I: E270-E274, E277-E27D
    *range(0xE270, 0xE275), *range(0xE277, 0xE27E),
    # O: E280-E283, E285-E286
    *range(0xE280, 0xE284), 0xE285, 0xE286,
    # P: E290-E291, E293-E296 (去掉E292)
    0xE290, 0xE291, 0xE293, 0xE294, 0xE295, 0xE296,
    # A: E2A0-E2AB, E2AE
    *range(0xE2A0, 0xE2AC), 0xE2AE,
    # S: E2B0-E2B5
    *range(0xE2B0, 0xE2B6),
    # D: E2C0-E2C3, E2C5-E2CB (去掉E2C4)
    *range(0xE2C0, 0xE2C4), *range(0xE2C5, 0xE2CC),
    # F: E2D0-E2D8
    *range(0xE2D0, 0xE2D9),
    # G: E2E0-E2E4, 9FB6, E2E7 (添加龶 U+9FB6)
    *range(0xE2E0, 0xE2E5), 0x9FB6, 0xE2E7,
    # H: E2EF-E2FB
    *range(0xE2EF, 0xE2FC),
    # J: E300-E307, E30A-E30B
    *range(0xE300, 0xE308), 0xE30A, 0xE30B,
    # K: E310-E312
    *range(0xE310, 0xE313),
    # L: E320-E32B
    *range(0xE320, 0xE32C),
    # M: E330-E336
    *range(0xE330, 0xE337),
    # X: E340-E346, E348-E34C
    *range(0xE340, 0xE347), *range(0xE348, 0xE34D),
    # C: E350-E353, E355-E356, E358 (去掉E354)
    *range(0xE350, 0xE354), 0xE355, 0xE356, 0xE358,
    # V: E360-E364, E367-E368, E22B (改为E22B)
    *range(0xE360, 0xE365), *range(0xE367, 0xE369), 0xE22B,
    # B: E370-E372, E374-E378, E37B-E37C (去掉E373, E37A, E379)
    *range(0xE370, 0xE373), *range(0xE374, 0xE379), 0xE37B, 0xE37C,
    # N: E380-E383, E385-E389, E38C-E38E
    *range(0xE380, 0xE384), *range(0xE385, 0xE38A), *range(0xE38C, 0xE38F),
]

# 转换为字符
all_chars = ''.join(chr(cp) for cp in sorted(set(all_codepoints)))

print(f"需要提取的字符数: {len(all_chars)}")
print(f"字符范围: U+{min(all_codepoints):04X} ~ U+{max(all_codepoints):04X}")

# 加载字体
print("\n加载字体文件...")
font = TTFont('/opt/projects/xtt/wubi_root_font.ttf')

# 创建subsetter
print("创建子集...")
subsetter = Subsetter()
subsetter.populate(text=all_chars)
subsetter.subset(font)

# 保存为WOFF2
output_path = '/opt/projects/xtt/wubi_radicals.woff2'
print(f"保存到: {output_path}")
font.flavor = 'woff2'
font.save(output_path)

print(f"\n✅ 完成！")
size = os.path.getsize(output_path)
print(f"子集大小: {size / 1024:.1f} KB")
print(f"字符数: {len(all_chars)}")
