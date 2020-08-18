const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteLinkEl = document.getElementById("website-link");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

function showModal() {
    modal.classList.add("show-modal");
    websiteNameEl.focus();
}

function closeModal() {
    modal.classList.remove("show-modal");
}

function validateLink(nameValue, linkValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if (!nameValue | !linkValue) {
        alert("Please submit both fields.");
        return false;
    }

    if (!linkValue.match(regex)) {
        alert("Enter a valid url.");
        return false;
    }

    return true;
}

function buildBookmarks() {
    bookmarksContainer.textContent = "";

    bookmarks.forEach((bookmark) => {
        const { name, link } = bookmark;

        // Create bookmark div
        const itemEl = document.createElement("div");
        itemEl.classList.add("btn");
        itemEl.classList.add("btn-item");
        // Create Img
        const imgEl = document.createElement("img");
        imgEl.setAttribute("src", `https://www.google.com/s2/favicons?domain=${link}`);
        imgEl.setAttribute("alt", "favicon");
        // Create link
        const linkEl = document.createElement("a");
        linkEl.classList.add("item__link");
        linkEl.setAttribute("href", link);
        linkEl.setAttribute("target", "_blank");
        linkEl.textContent = name;
        // Create close btn
        const closeEl = document.createElement("i");
        closeEl.classList.add("fas", "fa-times", "close-btn");
        closeEl.setAttribute("title", "Delete Bookmark");
        closeEl.setAttribute("onclick", `deleteBookmark('${link}')`);
        // Append to bookmarks
        itemEl.append(imgEl, linkEl, closeEl);
        bookmarksContainer.appendChild(itemEl);
    });
}

function fetchBookmarks() {
    if (localStorage.getItem("bookmarks")) {
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    } else {
        bookmarks = [
            {
                name: "Clarence's Personal Site",
                link: "https://theodorusclarence.github.io",
            },
        ];
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }

    buildBookmarks();
}

// Handle data from form submit
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    // Use let because we want to add http in front
    let linkValue = websiteLinkEl.value;
    if (!linkValue.includes("http://", "https://")) {
        linkValue = `https://${linkValue}`;
    }

    if (!validateLink(nameValue, linkValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        link: linkValue,
    };

    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

function deleteBookmark(link) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.link === link) {
            bookmarks.splice(i, 1);
        }

        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        fetchBookmarks();
    });
}

// Event Listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) => (e.target === modal ? closeModal() : false)); // if targets modal overlay
bookmarkForm.addEventListener("submit", storeBookmark);

// onload
fetchBookmarks();
