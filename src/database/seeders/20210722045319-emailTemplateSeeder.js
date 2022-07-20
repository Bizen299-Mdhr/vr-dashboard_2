'use strict';
require("module-alias/register");
const {emailTemplate} = require('@models');

module.exports = {
    up: async () => {
        let emailCode = [

            {
                'title': 'User Email Verification',
                'code': 'email_verification',
                'subject': 'Email Verification',
                'body': `  <table class="body" border="0" cellspacing="0" cellpadding="0">
      <tbody>
      <tr>
          <td>&nbsp;</td>
          <td class="container">
          <div class="content">
          <table class="main"><!-- START MAIN CONTENT AREA -->
                      <tbody>
                      <tr>
                          <td class="wrapper">
                              <table border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                  <tr>
                                      <td>                    
                                  <p>Dear %username%,</p>
                                  <p>Thank you for registering in our site. For a genuine user please activate through link provided in email.</p>
                                  <p>Activation Link : %url%</p>
                                  <p>If it wasn't you please ignore this message. Like always, if you have any questions please post your question on faq section.</p>   
                                  <p>=============================================<br />
                                  <br />
                                  <br/>
                                  Email: info@vrdashbord.info<br/>
                      =============================================</p>
                              </td>
                              </tr>
                          </tbody>
                      </table>
                      </td>
                      </tr>
                  <!-- END MAIN CONTENT AREA -->
              </tbody>
          </table>
          </td>
          <td>&nbsp;</td>
      </tr>
  </tbody>
  </table>                                         
    `
            },
            {
                'title': 'CMS Forgot Password',
                'code': 'forgot_password',
                'subject': 'Forgot Password',
                'body': `<table class="body" border="0" cellspacing="0" cellpadding="0">
      <tbody>
      <tr>
          <td>&nbsp;</td>
          <td class="container">
          <div class="content">
          <table class="main"><!-- START MAIN CONTENT AREA -->
                      <tbody>
                      <tr>
                          <td class="wrapper">
                              <table border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                  <tr>
                                      <td>   
                          <p>Dear %username%,</p>
                          <p>We got request for your password reset. If yes, please use the following link to reset your password.</p>
                          <p>Link : %url%</p>
                          <p>If it wasn't you please ignore this message. Like always, if you have any questions please post your question on faq section.</p>
                          <p>=============================================<br />
                          <br />
                          <br/>
                          Email: info@vrdashbord.info<br/>
                      =============================================</p>
                              </td>
                              </tr>
                          </tbody>
                      </table>
                      </td>
                      </tr>
                  <!-- END MAIN CONTENT AREA -->
              </tbody>
          </table>
          </td>
          <td>&nbsp;</td>
      </tr>
  </tbody>
  </table>
              `
            },
            {
                'title': 'CMS Email Verification',
                'code': 'cms_user_email_verification',
                'subject': 'User Email Verification',
                'body': `<table class="body" border="0" cellspacing="0" cellpadding="0">
      <tbody>
      <tr>
          <td>&nbsp;</td>
          <td class="container">
          <div class="content">
          <table class="main"><!-- START MAIN CONTENT AREA -->
                      <tbody>
                      <tr>
                          <td class="wrapper">
                              <table border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                  <tr>
                                      <td>
                                  <p>Dear %user%,</p>
                                  <p>We got request to verify your account. To verify your account, visit the following link.</p>
                                  <p>Username : %username%</p>
                                  <p>Password : %password%</p>
                                  <p><a href="%verification_link%">Verify now </a></p>
                                  <p>If it wasn't you please ignore this message. Like always, if you have any questions please post your question on faq section.</p>  
                                  <p>=============================================<br />
                                  <br />
                                  <br/>
                                  Email: vr.dashboard@mailinator<br/>
                      =============================================</p>
                              </td>
                              </tr>
                          </tbody>
                      </table>
                      </td>
                      </tr>
                  <!-- END MAIN CONTENT AREA -->
              </tbody>
          </table>
          </td>
          <td>&nbsp;</td>
      </tr>
  </tbody>
  </table>                                         
              `
            },
            {
                'title': 'CMS OTP Verification',
                'code': 'cms_otp_verification',
                'subject': 'OTP Verification',
                'body': `<table class="body" border="0" cellspacing="0" cellpadding="0">
      <tbody>
      <tr>
          <td>&nbsp;</td>
          <td class="container">
          <div class="content">
          <table class="main"><!-- START MAIN CONTENT AREA -->
                      <tbody>
                      <tr>
                          <td class="wrapper">
                              <table border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                  <tr>
                                      <td>
                                  <p>Dear %username%,</p>
                                  <p>Your OTP code is: %otp_code%</p>
                                  <p>If it wasn't you please ignore this message. Like always, if you have any questions please post your question on faq section.</p>  
                                  <p>=============================================<br />
                                  <br />
                                  <br/>
                                  Email: vr.dashboard@mailinator<br/>
                      =============================================</p>
                              </td>
                              </tr>
                          </tbody>
                      </table>
                      </td>
                      </tr>
                  <!-- END MAIN CONTENT AREA -->
              </tbody>
          </table>
          </td>
          <td>&nbsp;</td>
      </tr>
  </tbody>
  </table>                                         
              `
            },
            {
                'title': 'Password Changed Notification',
                'code': 'notify_password_changed',
                'subject': 'Password Changed',
                'body': `<table class="body" border="0" cellspacing="0" cellpadding="0">
      <tbody>
      <tr>
          <td>&nbsp;</td>
          <td class="container">
          <div class="content">
          <table class="main"><!-- START MAIN CONTENT AREA -->
                      <tbody>
                      <tr>
                          <td class="wrapper">
                              <table border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                  <tr>
                                      <td>
                                  <p>Dear %username%,</p>
                                  <p>Your password has been changed by admin.</p>
                                  <p>Changed password: %password%</p>
                                  <p>If it wasn't you please ignore this message. Like always, if you have any questions please post your question on faq section.</p>  
                                  <p>=============================================<br />
                                  <br />
                                  <br/>
                                  Email: vr.dashboard@mailinator.com<br/>
                      =============================================</p>
                              </td>
                              </tr>
                          </tbody>
                      </table>
                      </td>
                      </tr>
                  <!-- END MAIN CONTENT AREA -->
              </tbody>
          </table>
          </td>
          <td>&nbsp;</td>
      </tr>
  </tbody>
  </table>                                         
              `
            }

        ];
        for (const value of emailCode) {
            try {
                let email = await emailTemplate.findOne({where: {code: value.code}});
                if (!email) {
                    const emailTemp = new emailTemplate(value);
                    await emailTemp.save();
                }
            } catch (error) {
                console.log(error);
            }
        }
    },

    down: async () => {
        await emailTemplate.destroy({truncate: true, restartIdentity: true});
        return Promise.resolve();
    }
};
