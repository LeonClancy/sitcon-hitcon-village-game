// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.
var CardGame = function (targetId) {
    // private variables
    var cards = [];
    var card_value = ["1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "1H", "2H", "3H", "4H", "5H", "6H", "7H", "8H"];

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
        cards[id].firstChild.src = "//fcu-d0449763.github.io/sitcon_camp/images/back.png";
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
        cards[id].firstChild.src = "//fcu-d0449763.github.io/sitcon_camp/images/" + card_value[id] + ".png";
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
                        alertify.confirm('快至攤位兌換獎品吧！').set({
                            title: '恭喜完成闖關',
                            labels: {ok: '重新開始', cancel: '查看解析'},
                            closable: false,
                            onok: function (event) {
                                deal();
                            },
                            oncancel: function (event) {
                                window.location = './explain.html';
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
        card.innerHTML = "<img src=\"//fcu-d0449763.github.io/sitcon_camp/images/back.png\">";
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