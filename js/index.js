const usernameInput = document.querySelector('#username');
const submitButton = document.querySelector('.submit');
const clearButton = document.querySelector('.clear');
const userPhoto = document.querySelector('.user_photo');
const userNameBlogAddress = document.querySelector('.user_name_blog_address');
const userBio = document.querySelector('.user_bio');
const messageText = document.querySelector('.message');


// gets the data from the API and shows the data (first priority: local storage, second: requesting the API)
async function getUser(e) {
	let username = usernameInput.value;
	e.preventDefault();
        try {
        	let data = await JSON.parse(window.localStorage.getItem(username));
        	if (data != null) {
            		showDetails(data);
          		showMessage("From Local Storage!");
                } 
                else {
                	let response = await fetch(`https://api.github.com/users/${username}`);
            		let obj = await response.json();
            		if (response.status != 200) {
            			showMessage("Please enter a valid username");
                		return Promise.reject(`Request failed with error ${response.status}`);
            		}
	        	showDetails(obj);
	        	saveUser(obj);
	        
            	}
        }
        catch (e) {
            console.log(e);
        }
}

// show username's details result
function showDetails(obj) {
    	obj.name = obj.name?obj.name:"No name";
    	obj.blog = obj.blog?obj.blog:"No blog";
    	obj.location = obj.location?obj.location:"No location";
    	
    	obj.bio = obj.bio?obj.bio:"No bio";
    	
        userPhoto.innerHTML = "<img src=\""+ obj.avatar_url +"\" style=\"max-width: 80%;\" >";
        userNameBlogAddress.innerHTML = "<p>"+ obj.name +"</p>" + "<p>"+ obj.blog +"</p>" + "<p>"+ obj.location +"</p>";
        userBio.innerHTML = "<p>" + obj.bio.replace(/\n/g, "<br>") +"</p>";
}

// save username data in local storage
async function saveUser(obj) {
	let name = usernameInput.value;
        window.localStorage.setItem(name, JSON.stringify(obj));
	showMessage("Requested and Saved!");
}

// remove saved answer
function clearSavedData(e) {
	let name = usernameInput.value;
        e.preventDefault();
        window.localStorage.removeItem(name);
	showMessage("Removed!");
}

//shows message for 4 seconds
function showMessage(title) {
	messageText.style.display = "block";
	messageText.innerHTML = "<span>" + title + "</span>";
	setTimeout(() => {
        	messageText.style.display = "none";
    	}, 4000);
}

submitButton.addEventListener('click', getUser);
clearButton.addEventListener('click', clearSavedData);
window.localStorage.clear();
