let urlBox = document.getElementById("url");

function makeRequest()
{
	let url = urlBox.value.trim();

	if(url.length != 0)
	{
		req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(this.readyState==4)
			{
				let resultDiv = document.getElementById("response");

				resultDiv.innerHTML = "Status: " + this.status + "<br>";
				resultDiv.innerHTML += "Response Body: " + this.responseText;
			}
		}

		req.open(document.getElementById("method").value, "http://localhost:3000/" + url);
		req.send();
	}
	else
	{
		let resultDiv = document.getElementById("response");
		resultDiv.innerHTML = "Please fill the url box.";
	}
}
