import React, { useEffect, useState } from "react";

interface ComfortingMessagesProps {
  language: "en" | "zh";
}

const ComfortingMessages: React.FC<ComfortingMessagesProps> = ({
  language,
}) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const messages = {
    en: [
      "Our AI is doing push-ups to get stronger...",
      "Teaching our robots to moonwalk while processing...",
      "Counting to infinity, be right back...",
      "Convincing 1's and 0's to cooperate...",
      "Searching for the meaning of life... and your results!",
      "Trying to beat its own high score...",
      "Untangling some virtual spaghetti code...",
    ],
    zh: [
      "AI 正在做俯卧撑增强实力...",
      "正在教机器人一边处理一边跳月球舞...",
      "数到无穷大，马上回来...",
      "说服1和0和睦相处中...",
      "寻找人生的意义...顺便找您的结果！",
      "试图打破自己的高分记录...",
      "正在解开一些虚拟意大利面条代码...",
      "逗逗电子羊，很快就好...",
    ],
  };

  useEffect(() => {
    const changeMessage = () => {
      const currentMessages = messages[language];
      const randomIndex = Math.floor(Math.random() * currentMessages.length);
      setCurrentMessage(currentMessages[randomIndex]);
    };

    changeMessage(); // Set initial message

    const intervalId = setInterval(
      () => {
        changeMessage();
      },
      Math.random() * 1000 + 3000,
    ); // Random interval between 3-4 seconds

    return () => clearInterval(intervalId);
  }, [language]);

  return <div>{currentMessage}</div>;
};

export default ComfortingMessages;
