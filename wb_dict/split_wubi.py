#!/usr/bin/env python3
"""
五笔词库拆分工具 - Wubi Dictionary Splitter

将 wb86_all.txt 拆分为单字和词组两个文件：
- wb86_single.txt: 单字（单个汉字）
- wb86_phrase.txt: 词组（两个及以上汉字）

文件格式：每行 "编码 词语"
"""

import os
import sys
from pathlib import Path


def split_wubi_dictionary(input_file, output_single, output_phrase):
    """
    拆分五笔词库文件
    
    Args:
        input_file: 输入文件路径
        output_single: 单字输出文件路径
        output_phrase: 词组输出文件路径
    """
    # 检查输入文件是否存在
    if not os.path.exists(input_file):
        print(f"错误: 输入文件不存在: {input_file}")
        return False
    
    # 统计计数器
    total_count = 0
    single_count = 0
    phrase_count = 0
    error_count = 0
    
    print(f"开始处理文件: {input_file}")
    print(f"输出单字文件: {output_single}")
    print(f"输出词组文件: {output_phrase}")
    print("-" * 50)
    
    try:
        with open(input_file, 'r', encoding='utf-8') as infile, \
             open(output_single, 'w', encoding='utf-8') as single_file, \
             open(output_phrase, 'w', encoding='utf-8') as phrase_file:
            
            for line_num, line in enumerate(infile, 1):
                # 显示进度
                if line_num % 10000 == 0:
                    print(f"已处理 {line_num:,} 行...")
                
                line = line.strip()
                if not line:
                    continue  # 跳过空行
                
                total_count += 1
                
                # 解析行：编码 词语
                parts = line.split()
                if len(parts) < 2:
                    print(f"警告: 第 {line_num} 行格式错误: {line}")
                    error_count += 1
                    continue
                
                code = parts[0]
                word = parts[1]
                
                # 判断是单字还是词组
                # 单字：长度为1的汉字
                if len(word) == 1:
                    single_file.write(f"{code} {word}\n")
                    single_count += 1
                else:
                    phrase_file.write(f"{code} {word}\n")
                    phrase_count += 1
        
        print("-" * 50)
        print("处理完成!")
        print(f"总计: {total_count:,} 条记录")
        print(f"单字: {single_count:,} 条 ({single_count/total_count*100:.1f}%)")
        print(f"词组: {phrase_count:,} 条 ({phrase_count/total_count*100:.1f}%)")
        print(f"错误: {error_count:,} 条")
        
        # 验证输出文件
        if single_count > 0:
            print(f"单字文件已创建: {output_single} ({single_count:,} 行)")
        if phrase_count > 0:
            print(f"词组文件已创建: {output_phrase} ({phrase_count:,} 行)")
        
        return True
        
    except Exception as e:
        print(f"处理过程中发生错误: {e}")
        return False


def main():
    """主函数"""
    # 获取当前脚本所在目录
    script_dir = Path(__file__).parent
    
    # 文件路径
    input_file = script_dir / "wb86_all.txt"
    output_single = script_dir / "wb86_single.txt"
    output_phrase = script_dir / "wb86_phrase.txt"
    
    print("=" * 60)
    print("五笔词库拆分工具")
    print("=" * 60)
    
    # 检查输入文件
    if not input_file.exists():
        print(f"错误: 找不到输入文件: {input_file}")
        print("请确保 wb86_all.txt 文件存在于当前目录")
        return 1
    
    # 询问是否覆盖已存在的输出文件
    if output_single.exists() or output_phrase.exists():
        print("警告: 输出文件已存在!")
        response = input("是否覆盖现有文件? (y/N): ").strip().lower()
        if response != 'y':
            print("操作已取消")
            return 0
    
    # 执行拆分
    success = split_wubi_dictionary(str(input_file), str(output_single), str(output_phrase))
    
    if success:
        print("=" * 60)
        print("拆分完成!")
        return 0
    else:
        print("=" * 60)
        print("拆分失败!")
        return 1


if __name__ == "__main__":
    sys.exit(main())