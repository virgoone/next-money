import React, { useEffect, useState } from "react";

import { type Locale } from "@/i18n/routing";

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
      "AIがサイバー空間で腕立て伏せをしています。お待ちください...",
    ],
    ko: [
      "AI가 헬스장에서 열심히 운동 중입니다... 당신의 결과도 곧 나옵니다!",
      "로봇들에게 달빛 춤을 가르치면서 작업 중... 기대해 주세요!",
      "무한대까지 세어보는 중, 잠시만 기다려 주세요... 당신의 답이 곧 나옵니다!",
      "0과 1이 협력하기로 결정했습니다... 당신의 요청을 처리하는 중!",
      "인생의 의미를 찾아 헤매다가... 당신의 결과도 찾았습니다!",
      "자신의 최고점을 갱신하려는 AI... 조금만 기다려 주세요!",
      "가상의 스파게티 코드를 풀고 있는 중... 곧 해결됩니다!",
      "전자 양을 가지고 놀아주는 중, 금방 끝낼게요!",
      "AI가 집에서 청소를 하고 있어요... 당신의 결과도 깨끗하게 처리될 거예요!",
      "코드의 미스터리를 풀어내는 중... 당신의 문제도 곧 해결됩니다!",
      "AI가 스스로에게 도전하는 중... 당신의 기대에 부응할 거예요!",
      "가상의 요리사가 레시피를 살펴보는 중... 당신의 요구도 만족될 거예요!",
      "AI가 미래를 예측하며... 당신의 미래도 밝게 보일 거예요!",
    ],
    de: [
      "Unsere KI macht Liegestützen, um stärker zu werden...",
      "Unsere Roboter lernen gerade den Moonwalk, während sie arbeiten...",
      "Zählen bis ins Unendliche, bin gleich wieder da...",
      "Überzeugen die Einsen und Nullen, zusammenzuarbeiten...",
      "Auf der Suche nach dem Sinn des Lebens... und deinen Ergebnissen!",
      "Versucht, den eigenen Highscore zu knacken...",
      "Ein wenig virtuelles Spaghetti-Code entwirren...",
      "Unsere KI hat sich in eine Schleife verirrt, kommt gleich wieder raus...",
      "Programmieren die Roboter gerade ein Lied, bin gleich fertig...",
      "Unsere KI ist im Urlaub, aber sie wird gleich zurück sein...",
      "Unsere KI ist gerade dabei, ihre eigene Sprache zu lernen...",
      "Unsere KI hat sich verlaufen, aber sie findet den Weg zurück...",
      "Unsere KI ist gerade dabei, die Welt zu retten, bin gleich wieder da...",
    ],
    es: [
      "Preparando el desayuno para los bits... ¡Un momento, falta el café!",
      "Encontrando la tecla 'Enter' perdida... ¡Ah, ahí está!",
      "Ajustando el brillo de los píxeles... Un toque más... ¡Perfecto!",
      "Entrenando a los bytes para correr más rápido... ¡Vamos, puedes hacerlo!",
      "Llevando a los datos a dar un paseo por la nube... ¡No corras tanto!",
      "Encendiendo las luces del servidor... ¡Uno, dos, tres, luces encendidas!",
      "Organizando los archivos en la carpeta 'Importante'... ¡No, ese va en 'Papelera'!",
      "Calculando la ruta más rápida... ¡Ah, siempre es por el camino de 'Más rápido'!",
      "Revisando si los emojis están de acuerdo con la carga... 🚀✨👾",
      "Programando una pausa para que los datos respiren... ¡Ah, ya pueden seguir!",
      "Buscando la contraseña '1234' en la base de datos... ¡Ups, no era esa!",
      "Dando un chapuzón a los datos en la piscina de la red... ¡Que empiece la fiesta!",
      "Ensamblando los trozos del rompecabezas digital... ¡Casi listo!",
      "Llamando a los bits para que vuelvan a casa... ¡No se pierdan en el cable!",
      "Dibujando un smiley en la pantalla de carga... ¡Listo, ahora sonríe!",
    ],
    pt: [
      "Preparando o café para os bits... Um momento, onde está o açúcar?",
      "Ensinando os bytes a dançar lambada... Vamos, vocês podem!",
      "Ajustando o volume dos pixels... Um toque mais alto... Perfeito!",
      "Enrolando os dados para a corrida... Pronto, agora podem partir!",
      "Montando o quebra-cabeça digital... Quase lá!",
      "Encontrando o botão mágico 'Carregar'... Ah, aqui está!",
      "Organizando os arquivos em fila indiana... Não se misturem!",
      "Calculando a rota mais rápida... Ah, sempre é pelo caminho 'Mais rápido'!",
      "Revisando se os emojis estão de acordo com o carregamento... 🚀✨👾",
      "Programando uma pausa para que os dados respirem... Ah, já podem continuar!",
      "Buscando a senha '1234' na base de dados... Ops, não era essa!",
      "Dando um mergulho nos dados na piscina da rede... Que comece a festa!",
      "Ensamblando os pedaços do quebra-cabeça digital... Quase completo!",
      "Ligando os bits para que voltem para casa... Não se percam no cabo!",
      "Desenhando um smiley na tela de carregamento... Pronto, agora sorria!",
    ],
    ar: [
      "نظامنا الذكي يقوم بالضغط على الأرض ليصبح أقوى...",
      "نعلم إنسالتنا كيف تتحرك بطريقة 'مون ووك' أثناء المعالجة...",
      "نحن نعد إلى اللانهاية، سنعود للتو...",
      "نحن نقنع الواحدات والأصفار بالتعاون...",
      "نبحث عن معنى الحياة... ونتائجك!",
      "نحاول أن نتغلب على النتيجة العالية الخاصة بنا...",
      "نحن نفك شوكة الكود البرمجي الذي يشبه السباغيتي...",
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
