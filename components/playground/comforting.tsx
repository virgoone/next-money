import React, { useEffect, useState } from "react";

import { Locale } from "@/config";

interface ComfortingMessagesProps {
  language: Locale;
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
    fr: [
      "Notre IA fait des pompes pour devenir plus forte...",
      "En train d'enseigner aux robots à moonwalk tout en traitant...",
      "Comptage jusqu'à l'infini, je reviens tout de suite...",
      "Convaincre les 1 et les 0 de coopérer...",
      "À la recherche du sens de la vie... et de vos résultats !",
      "Essayant de battre son propre record...",
      "Déroulant un peu de code spaghetti virtuel...",
      "Taquinant le mouton électronique, ça sera bientôt prêt...",
    ],
    tw: [
      "AI 正在練肌肉，等會兒要讓你驚豔！",
      "機器人邊跳月球舞一邊算數，真是忙碌又充實。",
      "我這邊正跟無限大較勁，馬上回來報告好消息！",
      "正在努力讓數字和字母和睦相處，請稍候片刻。",
      "在尋找人生的解答，順便幫你把結果也找出來！",
      "想要打破紀錄的 AI，正在努力中，請給它點時間。",
      "解開這堆代碼就像解開壹包即食麵，馬上就會有好東西出現。",
      "逗逗電子羊，它快樂得像隻兔子，請再等一下下。",
    ],
    ja: [
      "AIがプロテインを飲んでパワーアップ中...",
      "ロボットに羊を数えさせています。お待ちください...",
      "量子の海で泳いでいます。すぐ戻ってきます！",
      "0と1を説得して仲良くさせています...",
      "人生の意味を探しています...そしてあなたの結果も！",
      "AIが自分のハイスコアに挑戦中です...",
      "バーチャル麺棒で絡まったコードをほぐしています...",
      "電子たい焼きを焼いています。もうすぐできます！",
      "AIが禅の悟りを開こうとしています。お待ちください...",
      "量子もつれを解いています。少々お待ちを...",
      "バグを捕まえに行きました。すぐ戻ります！",
      "AIがカップラーメンを待っています。3分だけお待ちを...",
      "ピクセルを一つずつ丁寧に並べています...",
      "機械学習の迷路で道を探しています。もうすぐ出口が！",
      "AIがサイバー空間で腕立て伏せをしています。お待ちください..."
    ]
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
