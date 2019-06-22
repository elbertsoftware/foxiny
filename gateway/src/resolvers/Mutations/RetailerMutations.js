// @flow

import { t } from '@lingui/macro';
const { addFragmentToInfo } = require('graphql-binding');
import logger from '../../utils/logger';
import { sendConfirmationText } from '../../utils/sms';
import { sendConfirmationEmail } from '../../utils/email';
import { sendConfirmationEsms } from '../../utils/smsVN';
import { getUserIDFromRequest, generateConfirmation, verifyConfirmation } from '../../utils/authentication';
import { checkUserSellerOwnership } from '../../utils/permissionChecker';
import { classifyEmailPhone } from '../../utils/productUtils/validation';

// TODO: log transactions

export const Mutation = {
  registerRetailer: async (parent, { data }, { prisma, request, cache, i18n }, info) => {
    // try {
    const userId = await getUserIDFromRequest(request, cache, i18n);

    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      '{ id email phone }',
    );

    if (!user) {
      const error = i18n._(t`User not found`);
      throw new Error(error);
    }

    // TODO: validate input
    // TODO: validate address

    // NOTE: verify email and phone
    if (data.businessEmail !== user.email) {
      // email:
      const matchedEmail = await verifyConfirmation(cache, data.emailConfirmCode, userId, i18n);
      if (matchedEmail) {
        const { email, phone } = classifyEmailPhone(matchedEmail);
        if ((email || phone) !== data.businessEmail) {
          logger.debug(`email confirmation matched: ${matchedEmail} but wrong email`);
          logger.debug(`code ${data.emailConfirmCode} enteredEmail ${data.businessEmail} codedEmail ${email}`);
          const error = i18n._(t`Unable to confirm user`);
          throw new Error(error);
        }
      } else {
        const error = i18n._(t`Unable to confirm user`);
        throw new Error(error);
      }
    }
    // phone:
    if (data.businessPhone !== user.phone) {
      const matchedPhone = await verifyConfirmation(cache, data.phoneConfirmCode, userId, i18n);
      if (matchedPhone) {
        const { email, phone } = classifyEmailPhone(matchedPhone);
        if ((email || phone) !== data.businessPhone) {
          logger.debug(`phone confirmation matched: ${matchedPhone} but wrong phone`);
          logger.debug(`code ${data.phoneConfirmCode} enteredPhone ${data.businessPhone} codedPhone ${phone}`);
          const error = i18n._(t`Unable to confirm user`);
          throw new Error(error);
        }
      } else {
        const error = i18n._(t`Unable to confirm user`);
        throw new Error(error);
      }
    }

    const retailerData = {
      businessName: data.businessName,
      businessPhone: data.businessPhone,
      businessEmail: data.businessEmail,
      businessAddress: {
        create: data.businessAddress,
      },
      owner: {
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    };

    const retailer = await prisma.mutation.createRetailer({
      data: retailerData,
    });

    // add role to user
    await prisma.mutation.updateUser({
      where: {
        id: userId,
      },
      data: {
        assignment: {
          update: {
            roles: {
              connect: {
                name: 'RETAILER',
              },
            },
          },
        },
      },
    });

    // open supportcase for approval
    await prisma.mutation.createSupportCase({
      data: {
        subject: 'New Retailer Approval',
        status: {
          connect: {
            name: 'OPEN',
          },
        },
        severity: {
          connect: {
            name: 'MEDIUM',
          },
        },
        catergory: {
          connect: {
            name: 'CREATE_RETAILER_APPROVAL',
          },
        },
        openByUser: {
          connect: {
            id: userId,
          },
        },
        retailerId: retailer.id,
      },
    });

    return {
      userId: userId,
      retailerId: retailer.id,
    };
    // } catch (err) {
    //   logger.error(`🛑❌  REGISTER_RETAILER: ${err}`);
    //   const error = i18n._(t`Cannot register retailer`);
    //   throw new Error(error);
    // }
  },

  updateRetailer: async (parent, { retailerId, data }, { prisma, request, cache, i18n }, info) => {
    // try {
    // NOTE: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    await checkUserSellerOwnership(prisma, cache, request, retailerId);

    const retailer = await prisma.query.retailer(
      {
        where: {
          id: retailerId,
        },
      },
      '{ id businessEmail businessPhone owner { user { id email phone }} }',
    );
    if (!retailer) {
      const error = i18n._(t`Retailer not found`);
    }

    // TODO: validate input

    // NOTE: verify email and phone
    if (data.businessEmail && data.businessEmail !== retailer.businessEmail) {
      if (data.businessEmail !== retailer.owner.user.email) {
        // email:
        const matchedEmail = await verifyConfirmation(cache, data.emailConfirmCode, userId, i18n);
        if (matchedEmail) {
          const { email, phone } = classifyEmailPhone(matchedEmail);
          if ((email || phone) !== data.businessEmail) {
            logger.debug(`email confirmation matched: ${matchedEmail} but wrong email`);
            logger.debug(`code ${data.emailConfirmCode} enteredEmail ${data.businessEmail} codedEmail ${email}`);
            const error = i18n._(t`Unable to confirm user`);
            throw new Error(error);
          }
        } else {
          const error = i18n._(t`Unable to confirm user`);
          throw new Error(error);
        }
      }
    }
    if (data.businessPhone && data.businessPhone !== retailer.businessPhone) {
      // phone:
      if (data.businessPhone !== retailer.owner.user.phone) {
        const matchedPhone = await verifyConfirmation(cache, data.phoneConfirmCode, userId, i18n);
        if (matchedPhone) {
          const { email, phone } = classifyEmailPhone(matchedPhone);
          if ((email || phone) !== data.businessPhone) {
            logger.debug(`email confirmation matched: ${matchedPhone} but wrong email`);
            logger.debug(`code ${data.emailConfirmCode} enteredEmail ${data.businessPhone} codedEmail ${email}`);
            const error = i18n._(t`Unable to confirm user`);
            throw new Error(error);
          }
        } else {
          const error = i18n._(t`Unable to confirm user`);
          throw new Error(error);
        }
      }
    }

    const updateData = {
      businessName: data.businessName,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      businessAddress: data.businessAddress
        ? {
            create: data.businessAddress,
          }
        : undefined,
      businessLink: data.businessLink,

      businessCover: data.businessCoverId
        ? {
            connect: {
              id: data.businessCoverId,
            },
          }
        : undefined,
      businessAvatar: data.businessAvatarId
        ? {
            connect: {
              id: data.businessAvatarId,
            },
          }
        : undefined,

      socialNumber: data.socialNumber,
      socialNumberImages: data.socialNumberImageIds
        ? {
            set: data.socialNumberImageIds.map(id => ({
              id: id,
            })),
          }
        : undefined,
      businessLicense: data.businessLicense,
      businessLicenseImages: data.businessLicenseImageIds
        ? {
            set: data.businessLicenseImageIds.map(id => ({
              id: id,
            })),
          }
        : undefined,
    };

    const fragment = '{ fragment retailerIdForRetailer on Retailer { id } }';
    const updatedRetailer = await prisma.mutation.updateRetailer(
      {
        where: {
          id: retailerId,
        },
        data: updateData,
      },
      addFragmentToInfo(info, fragment),
    );

    // open supportcase for approval
    await prisma.mutation.createSupportCase({
      data: {
        subject: 'New Retailer Approval',
        status: {
          connect: {
            name: 'OPEN',
          },
        },
        severity: {
          connect: {
            name: 'MEDIUM',
          },
        },
        catergory: {
          connect: {
            name: 'UPDATE_RETAILER_APPROVAL',
          },
        },
        openByUser: {
          connect: {
            id: userId,
          },
        },
        retailerId: updatedRetailer.id,
      },
    });

    return updatedRetailer;
    // } catch (err) {
    //   logger.error(`🛑❌  REGISTER_RETAILER: ${err}`);
    //   const error = i18n._(t`Cannot update retailer`);
    //   throw new Error(error);
    // }
  },

  // TODO: no need to check existed email
  resendRetailerConfirmationCode: async (parent, { emailOrPhone }, { prisma, request, cache, i18n }, info) => {
    const userId = await getUserIDFromRequest(request, cache, i18n);
    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      '{ id email phone }',
    );
    if (!user) {
      const error = i18n._(t`Cannot register retailer`);
      throw new Error(error);
    }

    if (!emailOrPhone) {
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    const { email, phone } = classifyEmailPhone(emailOrPhone);

    if (email) {
      if (user && user.email === email) {
        const error = i18n._(t`Confirmed`);
        throw new Error(error);
      }

      // check email is already registered or not
      // const existedUser = await prisma.query.user({
      //   where: {
      //     email: email,
      //   },
      // });
      // const existedRetailer = await prisma.query.retailer({
      //   where: {
      //     businessEmail: email,
      //   },
      // });

      // if (existedUser || existedRetailer) {
      //   const error = i18n._(t`Email is already existed`);
      //   throw new Error(error);
      // }

      const code = generateConfirmation(cache, userId, email);
      sendConfirmationEmail('Seller', email, code);

      return true;
    }

    if (phone) {
      if (user && user.phone === phone) {
        const error = i18n._(t`Confirmed`);
        throw new Error(error);
      }

      // check phone is already registered or not
      // const existedUser = await prisma.query.user({
      //   where: {
      //     phone: phone,
      //   },
      // });
      // const existedRetailer = await prisma.query.retailer({
      //   where: {
      //     businessPhone: phone,
      //   },
      // });

      // if (existedUser || existedRetailer) {
      //   const error = i18n._(t`Phone is already existed`);
      //   throw new Error(error);
      // }

      const code = generateConfirmation(cache, userId, phone);
      // sendConfirmationText("Seller", phone, code);
      sendConfirmationEsms('Seller', phone, code);

      return true;
    }

    return false;
  },
};
