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

		var fp = this.Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		fp.init(window, "Choose directory", nsIFilePicker.modeGetFolder);

		if(fp.show() == nsIFilePicker.returnOK)
		{
			document.getElementById("savemytabs-directory").value = this.filterDir(fp.fileURL.spec);
		}
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

		var directory = this.filterDir(document.getElementById("savemytabs-directory").value);

		if(!directory.length)
			directory = "Home";

		this.branch.setCharPref("directory", directory);
	},

	// Filter "file:///" from the directory name:
	filterDir: function(dir)
	{
		if(dir.indexOf("file:///") == 0)
		{
			dir = dir.substr(8);
		}

		return dir;
	}
};