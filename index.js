import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// localStorage
const savedTweetsData = localStorage.getItem('tweetsData');
if (savedTweetsData) {
    const parsedTweetsData = JSON.parse(savedTweetsData);
    tweetsData.length = 0;

    parsedTweetsData.forEach(tweet => {
        tweetsData.push(tweet);
    });
}

function saveDataToLocalStorage() {
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
}




// buttons function
document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    else if (e.target.dataset.userep) {
        handleUserReply(e.target.dataset.userep)
    }
})

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    saveDataToLocalStorage()
    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    saveDataToLocalStorage()
    render()
}

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')

    if (tweetInput.value.trim()) {
        tweetsData.unshift({
            handle: `@User`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value.trim(),
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        saveDataToLocalStorage()
        render()
        tweetInput.value = ''
    }

}
// User Reply function
function handleUserReply(tweetId) {
    const tweetIndex = tweetsData.findIndex(tweet => tweet.uuid === tweetId)
    console.log(tweetIndex)

    if (tweetIndex !== -1) {

        const replyInput = document.getElementById(`user-${tweetId}`)

        if (replyInput.value.trim()) {
            const reply = {
                handle: `@User`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: replyInput.value.trim()
            };
            tweetsData[tweetIndex].replies.unshift(reply);
            saveDataToLocalStorage()
            render()
            handleReplyClick(tweetId)
            replyInput.value = '';
        }
    }
}


function getFeedHtml() {
    let feedHtml = ``

    tweetsData.forEach(function (tweet) {

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ''

        if (tweet.replies.length) {
            tweet.replies.forEach(function (reply) {
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        // Input reply area
        let inputReply = ``
        if (tweet.replies) {
            inputReply += `
            <div class="reply-input-area">
            <img src="images/scrimbalogo.png" class="reply-profile-pic">
            <textarea class="user-reply" id="user-${tweet.uuid}" placeholder="Join the conversation!"></textarea>
            <button id="reply-btn" data-userep="${tweet.uuid}">Reply</button>
        </div>
            `
        }


        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${inputReply}
        ${repliesHtml}
    </div>   
</div>
`
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
    saveDataToLocalStorage()
}

render()

