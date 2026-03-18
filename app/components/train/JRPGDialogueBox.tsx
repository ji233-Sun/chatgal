/**
 * JRPGDialogueBox.tsx - 像素风格对话框组件
 *
 * 核心特性：
 * 1. 粗白边框，纯黑底色
 * 2. 打字机效果
 * 3. 屏幕底部中央
 * 4. 像素风格
 */

"use client";

import { useState, useEffect, useRef } from 'react';

interface JRPGDialogueBoxProps {
  visible: boolean;
  agentName: string;
  messages: string[];
  onClose: () => void;
}

export default function JRPGDialogueBox({ visible, agentName, messages, onClose }: JRPGDialogueBoxProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // 🎮 打字机效果
  useEffect(() => {
    if (!visible || currentMessageIndex >= messages.length) return;

    const message = messages[currentMessageIndex];
    let index = 0;
    setDisplayText('');
    setIsTyping(true);

    const typeNextChar = () => {
      if (index < message.length) {
        setDisplayText(message.substring(0, index + 1));
        index++;
        typingRef.current = setTimeout(typeNextChar, 50); // 每字符 50ms
      } else {
        setIsTyping(false);
      }
    };

    typeNextChar();

    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [visible, currentMessageIndex, messages]);

  // 点击继续到下一条消息
  const handleClick = () => {
    if (isTyping) {
      // 如果正在打字，立即完成
      const message = messages[currentMessageIndex];
      setDisplayText(message);
      setIsTyping(false);
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    } else {
      // 如果打字完成，进入下一条消息
      if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(currentMessageIndex + 1);
      } else {
        onClose();
      }
    }
  };

  if (!visible) return null;

  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10000] cursor-pointer"
      onClick={handleClick}
      style={{ width: '80%', maxWidth: '600px' }}
    >
      {/* 🎮 JRPG 风格对话框 */}
      <div
        className="relative bg-black border-4 border-white"
        style={{
          imageRendering: 'pixelated',
          boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* 说话人名字 */}
        <div className="bg-white text-black px-3 py-1 font-pixel text-[10px] font-bold">
          {agentName}
        </div>

        {/* 对话内容 */}
        <div className="p-4 min-h-[80px]">
          <p
            className="font-retro text-sm text-white leading-relaxed whitespace-pre-wrap"
            style={{
              imageRendering: 'pixelated',
              fontFamily: 'monospace',
            }}
          >
            {displayText}
            {isTyping && <span className="animate-pulse">▼</span>}
          </p>
        </div>

        {/* 继续提示 */}
        {!isTyping && (
          <div className="absolute bottom-2 right-3 font-pixel text-[8px] text-white/60 animate-pulse">
            点击继续 ▼
          </div>
        )}
      </div>
    </div>
  );
}
