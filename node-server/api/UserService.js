module.exports = {
	err:'',
	status:'',
	users:[],
	testVarInUserService:"testing, 1, 2, 3",
	user: {
		userName: 'admin',
		password: 'pw',
		authenticated: false
	},
	validateUser: function (login) {
		console.log("this.user: ", this.user, " and login: ", login);
		if (login.username === this.user.userName && login.password === this.user.password) {
			this.user.authenticated = true;
			this.users.push(this.user);
			this.status = "Log in successful...";
			return true;
		}
		else{
			this.status = "Invalid user and password. Please reference credentials or set new ones. Thanks.";
			this.user.authenticated = false;
			return false;
		}
	},
	getUserInfo: function () {
		if (this.user.authenticated) {
			return {username: this.user.username, authenticated: this.user.authenticated};
		}
	},
	logoutUser: function (){
		this.status = "Log out successful.";
		this.user.authenticated = false;
	}
};
