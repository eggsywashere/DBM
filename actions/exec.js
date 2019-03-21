module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Execute",

    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------

    section: "Other Stuff",

    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------

    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------

    subtitle: function (data) {
        return `Execute something.`;
    },

    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "EGGSY",

    // The version of the mod (Defaults to 1.0.0)
    version: "1.0.0",

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Executes bash commands.",

    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage: function (data, varType) {
        return 'Execution Result';
    },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["executeThis", "storage", "varName", "storage2", "errorVarName"],

    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editting actions. 
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information, 
    // so edit the HTML to reflect this.
    //
    // The "data" parameter stores constants for select elements to use. 
    // Each is an array: index 0 for commands, index 1 for events.
    // The names are: sendTargets, members, roles, channels, 
    //                messages, servers, variables
    //---------------------------------------------------------------------

    html: function (isEvent, data) {
        return `
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by EGGSY
		</p>
	</div><br>
<div style="width: 90%;">
	Execute:<br>
	<textarea id="executeThis" rows="9" placeholder="You can only run bash/CMD commands like 'node -v'..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store Result In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: left; padding-left: 12px; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
    </div>
</div><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store Error In:<br>
		<select id="storage2" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="errorNameContainer" style="float: left; padding-left: 12px; width: 60%;">
		Variable Name:<br>
		<input id="errorVarName" class="round" type="text">
    </div>
</div>
<span style="font-size: 12px">Errors will only be stored when there's an error (results will be undefined).</span>
	`
    },

    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------

    init: function () {
        const { glob, document } = this;

        glob.variableChange(document.getElementById('storage'), 'varNameContainer');
        glob.variableChange(document.getElementById('storage2'), 'varNameContainer');
    },

    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter, 
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------

    action: function (cache) {
        const data = cache.actions[cache.index],
            exec = require('child_process').exec,
            command = this.evalMessage(data.executeThis, cache),
            storage = parseInt(data.storage),
            varName = this.evalMessage(data.varName, cache),
            storage2 = parseInt(data.storage2),
            varName2 = this.evalMessage(data.errorVarName, cache);

        try { // Doing this will reduce the chance of getting your bot crashed.
            exec(command, (error, stdout) => {
                if (error) {
                    this.storeValue(error, storage2, varName2, cache);
                    this.callNextAction(cache);
                } else {
                    if (stdout) {
                        this.storeValue(stdout, storage, varName, cache);
                    }
                    this.callNextAction(cache);
                }
            });
        } catch (error) {
            if (error) {
                this.storeValue(error, storage2, varName2, cache);
                this.callNextAction(cache);
            }
        }
    },

    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflictions between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------

    mod: function (DBM) {
    }

}; // End of module
