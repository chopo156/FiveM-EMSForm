RegisterNetEvent('passInfo')
AddEventHandler('passInfo', function(info)
	SetNuiFocus(true, true)
	local data = {
		type = "result",
		firstName = info.firstName,
		lastName = info.lastName,
		dob = info.dob,
		allergies = info.allergies,
		injuries = info.injuries
	}
	SendNUIMessage(data)
end)

RegisterNetEvent('Response')
AddEventHandler('Response', function(message)
	SendNUIMessage({
		type = "response",
		message = message
	})
end)

function openCad()
	SendNUIMessage({
		type = "enableGUI"
	})
	SetNuiFocus(true, true)
end

function disableMenu()
	SendNUIMessage({
		type = "close"
	})
	SetNuiFocus(false, false)
end

function newForm()
	SendNUIMessage({
		type = "new"
	})
	SetNuiFocus(true, true)
end

RegisterNUICallback('close', function()
	disableMenu()
end)

RegisterNUICallback('new', function()
	newForm()
end)

RegisterNUICallback('search', function(data, cb)
	TriggerServerEvent('GetPtInfo', data)
end)

RegisterNUICallback('save', function(data, cb)
	if data.form == "newForm" then
		TriggerServerEvent('SavePtInfo', data)
	elseif data.form == "updateForm" then
		TriggerServerEvent('UpdatePtInfo', data)
	end
end)

RegisterNUICallback('delete', function(data, cb)
	TriggerServerEvent('DeletePtInfo', data)	
end)

RegisterCommand('cad', function()
	openCad()
end)
