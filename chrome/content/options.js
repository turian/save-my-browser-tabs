/*
   Copyright (c) 2010 Joseph Turian
   Developed by Dmitriy Khudorozhkov

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of Joseph Turian nor the names of its contributors
      may be used to endorse or promote products derived from this
      software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
   IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
   THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
   PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JOSEPH TURIAN BE LIABLE FOR
   ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
   OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
   HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
   STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
   IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   POSSIBILITY OF SUCH DAMAGE.
*/

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

		if(document.getElementById("savemytabs-directory").value == "Home")
		{
			filePicker.displayDirectory = this.Cc["@mozilla.org/file/directory_service;1"].getService(this.Ci.nsIProperties).get("Home", this.Ci.nsIFile);
		}
		else
		{
			try
			{
				var initialDirectory = this.Cc["@mozilla.org/file/local;1"].createInstance(this.Ci.nsILocalFile);
				initialDirectory.initWithPath(document.getElementById("savemytabs-directory").value);

				filePicker.displayDirectory = initialDirectory;
			}
			catch(e) { }
		}

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

		if(!period.length)
		{
			period = 15;
		}
		else
		{
			try
			{
				period = parseInt(period, 10);

				if(!period)
				{
					period = 15;
				}
				else
				{
					if(period < 0)
						period = 15;
				}
			}
			catch(e)
			{
				period = 15;
			}
		}

		this.branch.setIntPref("period", period);

		var directory = document.getElementById("savemytabs-directory").value;

		if(!directory.length)
			directory = "Home";

		this.branch.setCharPref("directory", directory);
	}
};