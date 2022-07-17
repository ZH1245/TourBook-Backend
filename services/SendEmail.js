//------------------------------------------------------------------------------------------------
/*
 * Email Service for Notifications and Updates using Nodemailer and ZohoMail
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const UserModel = require("../models/UserModel");
require("dotenv").config();
const fromMail = process.env.MAIL;
const fromPass = process.env.PASS;
//------------------------------------------------------------------------------------------------
const sendVerificationEmail = async ({ name, email, confirmationCode }) => {
  const transporter = await nodemailer.createTransport({
    service: "zoho",
    auth: {
      user: fromMail,
      pass: fromPass,
    },
  });
  await transporter
    .sendMail({
      from: fromMail,
      to: email,
      subject: "TourBook : Please Verify your Email",
      html: `<body>
      <table style="align:center;">
        <tbody>
          <tr style="vertical-align: top">
            <td
              style="
                word-break: break-word;
                border-collapse: collapse !important;
                vertical-align: top;
              "
            >
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f5f5f5;"><![endif]-->
  
              <div
                class="u-row-container"
                style="padding: 0px; background-color: #fbea41"
              >
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 600px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: transparent;
                  "
                >
                  <div
                    style="
                      border-collapse: collapse;
                      display: table;
                      width: 100%;
                      background-color: transparent;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #fbea41;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div
                      class="u-col u-col-100"
                      style="
                        max-width: 320px;
                        min-width: 600px;
                        display: table-cell;
                        vertical-align: top;
                      "
                    >
                      <div style="width: 100% !important">
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                          "
                        ><!--<![endif]-->
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <div
                class="u-row-container"
                style="padding: 0px; background-color: #fbea41"
              >
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 600px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: #ffffff;
                  "
                >
                  <div
                    style="
                      border-collapse: collapse;
                      display: table;
                      width: 100%;
                      background-color: transparent;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #fbea41;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                    <div
                      class="u-col u-col-100"
                      style="
                        max-width: 320px;
                        min-width: 600px;
                        display: table-cell;
                        vertical-align: top;
                      "
                    >
                      <div
                        style="
                          width: 100% !important;
                          border-radius: 0px;
                          -webkit-border-radius: 0px;
                          -moz-border-radius: 0px;
                        "
                      >
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                            border-radius: 0px;
                            -webkit-border-radius: 0px;
                            -moz-border-radius: 0px;
                          "
                        ><!--<![endif]-->
                          <table
                            style="font-family: arial, helvetica, sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="v-container-padding-padding"
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 30px 10px 20px;
                                    font-family: arial, helvetica, sans-serif;
                                  "
                                  align="left"
                                >
                                  <h1
                                    style="
                                      margin: 0px;
                                      color: #171046;
                                      line-height: 140%;
                                      text-align: center;
                                      word-wrap: break-word;
                                      font-weight: normal;
                                      font-family: 'Raleway', sans-serif;
                                      font-size: 49px;
                                    "
                                  >
                                    <strong>Welcome!</strong>
                                  </h1>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <div
                class="u-row-container"
                style="padding: 0px; background-color: transparent"
              >
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 600px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: #ffffff;
                  "
                >
                  <div
                    style="
                      border-collapse: collapse;
                      display: table;
                      width: 100%;
                      background-color: transparent;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                    <div
                      class="u-col u-col-100"
                      style="
                        max-width: 320px;
                        min-width: 600px;
                        display: table-cell;
                        vertical-align: top;
                      "
                    >
                      <div
                        style="
                          width: 100% !important;
                          border-radius: 0px;
                          -webkit-border-radius: 0px;
                          -moz-border-radius: 0px;
                        "
                      >
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                            border-radius: 0px;
                            -webkit-border-radius: 0px;
                            -moz-border-radius: 0px;
                          "
                        ><!--<![endif]-->
                          <table
                            id="u_content_image_2"
                            style="font-family: arial, helvetica, sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="v-container-padding-padding"
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 10px;
                                    font-family: arial, helvetica, sans-serif;
                                  "
                                  align="left"
                                >
                                  <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          style="
                                            padding-right: 0px;
                                            padding-left: 0px;
                                          "
                                          align="center"
                                        >
                                          <img
                                            align="center"
                                            border="0"
                                            src="https://cdn.templates.unlayer.com/assets/1636450033923-19197947.png"
                                            alt="Hero Image"
                                            title="Hero Image"
                                            style="
                                              outline: none;
                                              text-decoration: none;
                                              -ms-interpolation-mode: bicubic;
                                              clear: both;
                                              display: inline-block !important;
                                              border: none;
                                              height: auto;
                                              float: none;
                                              width: 51%;
                                              max-width: 295.8px;
                                            "
                                            width="295.8"
                                            class="v-src-width v-src-max-width"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <table
                            id="u_content_heading_2"
                            style="font-family: arial, helvetica, sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="v-container-padding-padding"
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 35px;
                                    font-family: arial, helvetica, sans-serif;
                                  "
                                  align="left"
                                >
                                  <h3
                                    style="
                                      margin: 0px;
                                      color: #868686;
                                      line-height: 170%;
                                      text-align: center;
                                      word-wrap: break-word;
                                      font-weight: normal;
                                      font-family: 'Cabin', sans-serif;
                                      font-size: 23px;
                                    "
                                  >
                                    We're excited to have you get started! First
                                    you need to confirm your account. Just click
                                    the button below.
                                  </h3>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <table
                            id="u_content_button_1"
                            style="font-family: arial, helvetica, sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="v-container-padding-padding"
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 20px 10px;
                                    font-family: arial, helvetica, sans-serif;
                                  "
                                  align="left"
                                >
                                  <div align="center">
                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:arial,helvetica,sans-serif;"><tr><td style="font-family:arial,helvetica,sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:56px; v-text-anchor:middle; width:320px;" arcsize="2%" stroke="f" fillcolor="#181147"><w:anchorlock/><center style="color:#ffffff;font-family:arial,helvetica,sans-serif;"><![endif]-->
                                    <a
                                      href=${`http://tourbook-backend.herokuapp.com/user/validate/?email=${email}&code=${confirmationCode}`}
                                      target="_blank"
                                      class="v-size-width"
                                      style="
                                        box-sizing: border-box;
                                        display: inline-block;
                                        font-family: arial, helvetica, sans-serif;
                                        text-decoration: none;
                                        -webkit-text-size-adjust: none;
                                        text-align: center;
                                        color: #ffffff;
                                        background-color: #181147;
                                        border-radius: 1px;
                                        -webkit-border-radius: 1px;
                                        -moz-border-radius: 1px;
                                        width: 55%;
                                        max-width: 100%;
                                        overflow-wrap: break-word;
                                        word-break: break-word;
                                        word-wrap: break-word;
                                        mso-border-alt: none;
                                      "
                                    >
                                      <span
                                        style="
                                          display: block;
                                          padding: 16px 21px 18px 20px;
                                          line-height: 120%;
                                        "
                                        ><span
                                          style="
                                            font-family: Cabin, sans-serif;
                                            font-size: 18px;
                                            line-height: 21.6px;
                                          "
                                          ><strong
                                            ><span
                                              style="
                                                line-height: 21.6px;
                                                font-size: 18px;
                                              "
                                              ><span
                                                style="
                                                  line-height: 21.6px;
                                                  font-size: 18px;
                                                "
                                                >Confirm Your Account</span
                                              ></span
                                            ></strong
                                          ></span
                                        ></span
                                      >
                                    </a>
                                    <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <table
                            id="u_content_text_2"
                            style="font-family: arial, helvetica, sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="v-container-padding-padding"
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 10px 35px 70px;
                                    font-family: arial, helvetica, sans-serif;
                                  "
                                  align="left"
                                >
                                  <div
                                    style="
                                      color: #868686;
                                      line-height: 180%;
                                      text-align: left;
                                      word-wrap: break-word;
                                    "
                                  >
                                    <p style="font-size: 14px; line-height: 180%">
                                      <span
                                        style="
                                          font-family: Cabin, sans-serif;
                                          font-size: 16px;
                                          line-height: 28.8px;
                                        "
                                        >If you have any questions. Please feel
                                        free to inform - We're always ready to
                                        help out.</span
                                      >
                                    </p>
                                    <p style="font-size: 14px; line-height: 180%">
                                      &nbsp;
                                    </p>
                                    <p style="font-size: 14px; line-height: 180%">
                                      <span
                                        style="
                                          font-family: Cabin, sans-serif;
                                          font-size: 18px;
                                          line-height: 32.4px;
                                        "
                                        >Cheers,</span
                                      >
                                    </p>
                                    <p style="font-size: 14px; line-height: 180%">
                                      <strong
                                        ><span
                                          style="
                                            font-family: Cabin, sans-serif;
                                            font-size: 18px;
                                            line-height: 32.4px;
                                          "
                                          >TourBook</span
                                        ></strong
                                      >
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <div
                class="u-row-container"
                style="padding: 0px; background-color: transparent"
              >
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 600px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: #f7d845;
                  "
                >
                  <div
                    style="
                      border-collapse: collapse;
                      display: table;
                      width: 100%;
                      background-color: transparent;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f7d845;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                    <div
                      class="u-col u-col-100"
                      style="
                        max-width: 320px;
                        min-width: 600px;
                        display: table-cell;
                        vertical-align: top;
                      "
                    >
                      <div
                        style="
                          width: 100% !important;
                          border-radius: 0px;
                          -webkit-border-radius: 0px;
                          -moz-border-radius: 0px;
                        "
                      >
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                            border-radius: 0px;
                            -webkit-border-radius: 0px;
                            -moz-border-radius: 0px;
                          "
                        ><!--<![endif]-->
                          <table
                            style="font-family: arial, helvetica, sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="v-container-padding-padding"
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 13px 10px;
                                    font-family: arial, helvetica, sans-serif;
                                  "
                                  align="left"
                                >
                                  <div
                                    style="
                                      color: #000000;
                                      line-height: 140%;
                                      text-align: center;
                                      word-wrap: break-word;
                                    "
                                  >
                                    <p style="font-size: 14px; line-height: 140%">
                                      <span
                                        style="
                                          font-family: Cabin, sans-serif;
                                          font-size: 14px;
                                          line-height: 19.6px;
                                        "
                                        >© 2022 TourBook. All Rights
                                        Reserved.</span
                                      >
                                      <span
                                        >A Project By COMSATS University
                                        Students</span
                                      >
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </body>`,
    })
    .catch((e) => console.log(e));
};
//------------------------------------------------------------------------------------------------
const sendForgotPassword = async ({ name, email, confirmationCode }) => {
  const transporter = await nodemailer.createTransport({
    service: "zoho",
    auth: {
      user: fromMail,
      pass: fromPass,
    },
  });
  await transporter.sendMail({
    from: fromMail,
    to: email,
    subject: "TourBook : Forgot Password",
    html: `<h1>TourBook : Password Reset Code</h1>
        <h2>Hello ${name}</h2>
        <p>Your Password Reset Code is : <b>${confirmationCode}</b></p>
        </div>`,
  });
};
//------------------------------------------------------------------------------------------------
const sendInfoEmail = async ({ name, email, subject, html }) => {
  const transporter = await nodemailer.createTransport({
    service: "zoho",
    auth: {
      user: fromMail,
      pass: fromPass,
    },
  });
  try {
    await transporter.sendMail({
      from: fromMail,
      to: email,
      subject: subject,
      html: html,
    });
  } catch (e) {
    throw e;
  }
};
//------------------------------------------------------------------------------------------------
module.exports = { sendVerificationEmail, sendForgotPassword, sendInfoEmail };
