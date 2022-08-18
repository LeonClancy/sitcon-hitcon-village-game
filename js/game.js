// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

// TODO
const config = {
    "1C": "常見遊戲外掛製作手法？",
    "2C": "阻礙別人追蹤記憶體位置的手法？",
    "3C": "常見的 HTTP status code？",
    "4C": "什麼是 CTF？",
    "5C": "Domain 由 CDN 託管的好處？",
    "6C": "掃瞄子網域與服務端口的工具？",
    "7C": "負責解析網域名稱的服務是？",
    "8C": "這個攤位是什麼組織？",
    "1H": "DLL Injection",
    "2H": "Address Space Layout Randomization",
    "3H": "200<br>404<br>500",
    "4H": "Capture The Flag",
    "5H": "隱藏真實 IP",
    "6H": "dnsdumpster",
    "7H": "DNS",
    "8H": "SITCON<br><span style=\"font-size:.8em;\">學生計算機年會</span>"
}

const gameEndAlert = {
    content: "content",
    title: "This is title",
    labels: {ok: '重新開始'}
}; 

var CardGame = function (targetId) {
    // private variables
    var cards = [];
    const card_value = Object.keys(config);
    var started = false;
    var matches_found = 0;
    var card1 = false,
        card2 = false;
    var clickable = [];

    //隱藏卡片
    var hideCard = function (id) // turn card face down
    {
        setTimeout(function () {
            clickable.push(id);
        }, 500);
        cards[id].firstChild.src = "images/backinfo.png";
        $(cards[id]).children('.card-content').remove();
        with (cards[id].style) {
            WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
        }
    };

    var moveToPack = function (id) // move card to pack
    {
        hideCard(id);
        cards[id].matched = true;
        with (cards[id].style) {
            zIndex = "1000";
            top = "15px";
            left = "15px";
            WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
            zIndex = "0";
        }
    };

    var moveToFinish = function (id) // move card to pack
    {
        cards[id].matched = true;
        with (cards[id].style) {
            zIndex = "1000";
            WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
            zIndex = "0";
        }
    };


    var moveToPlace = function (id) // deal card
    {
        setTimeout(function () {
            clickable.push(id);
        }, 500);
        cards[id].matched = false;
        with (cards[id].style) {
            zIndex = "1000";
            top = cards[id].fromtop + "px";
            left = cards[id].fromleft + "px";
            WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
            zIndex = "0";
        }
    };
    //dolist:點擊之後
    var showCard = function (id) // turn card face up, check for match
    {
        clickable.splice($.inArray(id, clickable), 1);
        if (id === card1) return;
        if (cards[id].matched) return;
        cards[id].className = "card";

        var cardContent;
        if (card_value[id].endsWith('C')){
            cards[id].firstChild.src = "images/q.png";
            cardContent = $(`<span class="card-content" style="color:black;">${config[card_value[id]]}</span>`);
        } else {
            cards[id].firstChild.src = "images/a.png";
            cardContent = $(`<span class="card-content" style="color:white;">${config[card_value[id]]}</span>`);
        }
        $(cards[id]).append(cardContent);
        //點擊後放大並旋轉-5度
        with (cards[id].style) {
            WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(-5deg)";
        }

        if (card1 !== false) {
            card2 = id;

            if (parseInt(card_value[card1]) == parseInt(card_value[card2])) { // match found
                (function (card1, card2) {
                    setTimeout(function () {
                        moveToFinish(card1);
                        moveToFinish(card2);
                    }, 1000);
                })(card1, card2);

                if (++matches_found == 8) { // game over, reset
                    matches_found = 0;
                    started = false;
                    for (i = 0; i < 16; i++) {
                        (function (idx) {
                            setTimeout(function () {
                                moveToPack(idx);
                            }, idx * 100);
                        })(i);
                    }
                    setTimeout(function () {
                        startCard();
                        // TODO
                        alertify.confirm(gameEndAlert.content).set({
                            title:  gameEndAlert.title,
                            labels: gameEndAlert.labels,
                            closable: false,
                            onok: function (event) {
                                deal();
                            }
                        });
                    }, 16 * 100);
                }
            } else { // no match
                (function (card1, card2) {
                    setTimeout(function () {
                        hideCard(card1);
                        hideCard(card2);
                    }, 1800);
                })(card1, card2);
            }
            card1 = card2 = false;
        } else { // first card turned over
            card1 = id;
        }
    };

    //點擊第一張之後亂數決定卡片位置
    var cardClick = function (id) {
        //防止連點或動畫中點擊
        if ($.inArray(id, clickable) === -1) return;
        showCard(id);
    };

    //發牌
    var deal = function () {
        // shuffle and deal cards
        card_value.sort(function () {
            return Math.round(Math.random()) - 0.5;
        });
        for (i = 0; i < 16; i++) {
            (function (idx) {
                setTimeout(function () {
                    moveToPlace(idx);
                }, idx * 100);
            })(i);
        }
        started = true;
    };

    // initialise 初始化
    var startCard = function () {
        cards = [];
        $('.card').remove();

        // template for card
        var card = document.createElement("div");
        card.innerHTML = "<img src=\"images/backinfo.png\">";
        card.className = "card";

        for (var i = 0; i < 16; i++) {
            var newCard = card.cloneNode(true);
            newCard.className = "card";
            newCard.fromtop = 15 + window.innerHeight / 4 * Math.floor(i / 4);
            newCard.fromleft = 15 + window.innerWidth / 4 * (i % 4);
            (function (idx) {
                newCard.addEventListener("click", function () {
                    cardClick(idx);
                }, false);
            })(i);

            document.body.appendChild(newCard);
            cards.push(newCard);
        }

    };

    alertify.alert('駭，你好！', '<div>請根據卡牌上的題目找到相對應的答案！</br>卡牌說明：</br><img style="height:20vh;" src="images/question.png">  <img style="height:20vh;" src="images/ans.png">  <img style="height:20vh;" src="images/backinfo.png"></div>').set({
        label: '開始',
        closable: false,
        onok: function (closeEvent) {
            deal();
        }
    });

    startCard();
};