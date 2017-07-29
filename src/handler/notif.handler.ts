export default function NotifHandler(app, mailService) {

  app.get('/apiv2/notif', function(req, res) {
    mailService.sendMail();
    res.send('ok');
  });

};
