const express = require('express');
const nodemailer = require('nodemailer');
// const Mail = require('nodemailer/lib/mailer')



const MailSender = (req, res, next) => {
    const Transporter = nodemailer.createTransport ({
        service: 'gmail',
        auth: {
            user: 'harshaithireddy446@gmail.com',
            pass: 'wajn omib sjer vlpd'
        }
    })
    const MailOptions = {
        from : "harshaithireddy446@gmail.com",
        to : req.body.email,
        subject : "Sending Email using Nodemailer",
        text : "Hello, This is Harsha Ithireddy. I hope this email works fine."
    }
    

    Transporter.sendMail(MailOptions, (err, info) => {
        if(err) {
            return res.status(500).json({ message: err.message });
        }
        return res.status(200).json('Mail Sent Successfully !');
    })
}


exports.MailSender = MailSender;