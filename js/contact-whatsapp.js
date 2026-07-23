document.addEventListener('DOMContentLoaded', function () {
	var form = document.getElementById('contactForm');
	if (!form) return;

	var WHATSAPP_NUMBER = '256787353969';

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		var fname = (document.getElementById('fname').value || '').trim();
		var lname = (document.getElementById('lname').value || '').trim();
		var email = (document.getElementById('email').value || '').trim();
		var subject = (document.getElementById('subject').value || '').trim();
		var message = (document.getElementById('message').value || '').trim();

		var lines = ['Hi Bullion Events,'];
		var name = (fname + ' ' + lname).trim();
		if (name) lines.push('My name is ' + name + '.');
		if (subject) lines.push('Subject: ' + subject);
		if (message) lines.push(message);
		if (email) lines.push('(Reach me at ' + email + ')');

		var text = encodeURIComponent(lines.join('\n'));
		var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;

		window.open(url, '_blank', 'noopener');
		form.reset();
	});
});
