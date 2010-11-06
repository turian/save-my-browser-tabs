var savemytabs = {

	// Shortcuts:
	Cc: Components.classes,
	Ci: Components.interfaces,

	// Preference branch of extension:
	branch: null,

	// Initialization:
	init: function()
	{
		// Initialize preferences:
		var prefservice = this.Cc["@mozilla.org/preferences-service;1"].getService(this.Ci.nsIPrefService);
		this.branch = prefservice.getBranch("extensions.savemytabs.");

		// Prepare the first run:
		var that = this;

		setTimeout(function()
		{
			that.save();
		},
		this.branch.getIntPref("period") * 60 * 1000)
	},

	// Saving the state of tabs:
	save: function()
	{
		// Cycle through the tabs:
		var nbrowsers = gBrowser.browsers.length;
		var lines = [];

		for(var i = 0; i < nbrowsers; i++)
		{
			var browser = gBrowser.browsers[i];

			lines.push(browser.currentURI.spec + "\t" + browser.contentDocument.title);
		}

		// Extract current date/time:
		function prepare(num)
		{
			var str = String(num);

			if(str.length < 2)
				str = "0" + str;

			return str;
		}

		var today = new Date();
		var yyyy = today.getFullYear();
		var mm = today.getMonth() + 1;
		var dd = today.getDate();
		var hh = today.getHours();
		var min = today.getMinutes();

		// Get the directory to save to:
		var file = this.Cc["@mozilla.org/file/directory_service;1"].getService(this.Ci.nsIProperties).get("Home", this.Ci.nsIFile);
		file.append("opentabs-" + String(yyyy) + prepare(mm) + prepare(dd) + "-" + prepare(hh) + prepare(min) + ".txt");

		// Create file output stream:
		var foStream = this.Cc["@mozilla.org/network/file-output-stream;1"].createInstance(this.Ci.nsIFileOutputStream);

		// Write, create, truncate:
		foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);

		// Be sure to write Unicode:
		var converter = this.Cc["@mozilla.org/intl/converter-output-stream;1"].createInstance(this.Ci.nsIConverterOutputStream);
		converter.init(foStream, "UTF-8", 0, 0);
		converter.writeString(lines.join("\r\n"));
		converter.close();

		// Prepare for the next iteration:
		var that = this;

		setTimeout(function()
		{
			that.save();
		},
		this.branch.getIntPref("period") * 60 * 1000);
	}
};

window.addEventListener("load", function() { savemytabs.init(); }, false);