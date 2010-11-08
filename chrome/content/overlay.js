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

var savemytabs = {

	// Shortcuts:
	Cc: Components.classes,
	Ci: Components.interfaces,

	// Preference branch of extension:
	branch: null,

	// Initialization:
	init: function()
	{
		// Check if we're running the very 1st instance of browser or not:
		var instances = 0;

		var wm = this.Cc["@mozilla.org/appshell/window-mediator;1"].getService(this.Ci.nsIWindowMediator);  
		var browserEnumerator = wm.getEnumerator("navigator:browser");  

		while(browserEnumerator.hasMoreElements())
		{
			var browserWin = browserEnumerator.getNext();
			++instances;
		}

		// Don't initialize if there are more open windows:
		if(instances > 1)
			return;

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
		var lines = [];

		// Cycle through the windows:
		var wm = this.Cc["@mozilla.org/appshell/window-mediator;1"].getService(this.Ci.nsIWindowMediator);  
		var browserEnumerator = wm.getEnumerator("navigator:browser");  

		while(browserEnumerator.hasMoreElements())
		{
			var browserWin = browserEnumerator.getNext();
			var tabbrowser = browserWin.gBrowser;

			// Cycle through the tabs:
			var nbrowsers = tabbrowser.browsers.length;

			for(var i = 0; i < nbrowsers; i++)
			{
				var browser = tabbrowser.browsers[i];

				lines.push(browser.currentURI.spec.replace("\t", " ") + "\t" + browser.contentDocument.title.replace("\t", " "));
			}
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
		var file = null;
		if(this.branch.getCharPref("directory") == "Home")
		{
			file = this.Cc["@mozilla.org/file/directory_service;1"].getService(this.Ci.nsIProperties).get("Home", this.Ci.nsIFile);
		}
		else
		{
			file = this.Cc["@mozilla.org/file/local;1"].createInstance(this.Ci.nsILocalFile);
			file.initWithPath(this.branch.getCharPref("directory"));
		}

		if(file && file.exists)
		{
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
		}

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