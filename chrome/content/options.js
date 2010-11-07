if(!savemytabs) { var savemytabs = {}; }

savemytabs.options = {

	// Preference branch of extension:
	branch: null,

	// API shortcuts:
	Cc: Components.classes,
	Ci: Components.interfaces,

	load: function()
	{
		var prefservice = this.Cc["@mozilla.org/preferences-service;1"].getService(this.Ci.nsIPrefService);
		this.branch = prefservice.getBranch("extensions.savemytabs.");

		document.getElementById("savemytabs-period").value = this.branch.getIntPref("period");
		document.getElementById("savemytabs-directory").value = this.branch.getCharPref("directory");
	},

	chooseDir: function()
	{
		const nsIFilePicker = this.Ci.nsIFilePicker;

		var filePicker = this.Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		filePicker.init(window, "Choose directory", nsIFilePicker.modeGetFolder);

		try
		{
			var initialDirectory = this.Cc["@mozilla.org/file/local;1"].createInstance(this.Ci.nsILocalFile);
			initialDirectory.initWithPath(document.getElementById("savemytabs-directory").value);

			filePicker.displayDirectory = initialDirectory;
		}
		catch(e) { }

		if(filePicker.show() == nsIFilePicker.returnOK)
			document.getElementById("savemytabs-directory").value = filePicker.file.path;
	},

	reset: function()
	{
		document.getElementById("savemytabs-directory").value = "Home";
	},

	save: function()
	{
		// Sanity checks for values:

		var period = document.getElementById("savemytabs-period").value;

		try
		{
			period = parseInt(period, 10);

			if(!period)
			{
				period = 15;
			}
		}
		catch(e)
		{
			period = 15;
		}

		this.branch.setIntPref("period", period);

		var directory = document.getElementById("savemytabs-directory").value;

		if(!directory.length)
			directory = "Home";

		this.branch.setCharPref("directory", directory);
	}
};