// @flow

import { t } from "@lingui/macro";
import { addFragmentToInfo } from "graphql-binding";
import { pubsubConfig } from "../Subscriptions/SubscriptionConfig";
import logger from "../../utils/logger";
import { sendConfirmationText } from "../../utils/sms";
import { sendConfirmationEmail } from "../../utils/email";
import { sendConfirmationEsms } from "../../utils/smsVN";
import {
  getUserIDFromRequest,
  generateConfirmation,
  verifyConfirmation,
} from "../../utils/authentication";
import { gatekeeper } from "../../utils/permissionChecker";
import { classifyEmailPhone } from "../../utils/productUtils/validation";

// TODO: log transactions

export const Mutation = {
  registerRetailer: async (
    parent,
    { data },
    { prisma, request, cache, i18n, pubsub },
    info,
  ) => {
    try {
      // NOTE: check permission
      const user = await gatekeeper.checkPermissions(
        request,
        "REGISTER_RETAILER",
        i18n,
      );

      // TODO: validate input
      // TODO: validate address

      // NOTE: verify email and phone
      if (data.businessEmail !== user.email) {
        // email:
        const matchedEmail = await verifyConfirmation(
          cache,
          data.emailConfirmCode,
          user.id,
          i18n,
        );
        if (matchedEmail) {
          const { email, phone } = classifyEmailPhone(matchedEmail);
          if ((email || phone) !== data.businessEmail) {
            logger.debug(
              `email-confirmation-code matched: ${matchedEmail} but wrong email`,
            );
            logger.debug(
              `confirm-code ${data.emailConfirmCode} enteredEmail ${
                data.businessEmail
              } codedEmail ${email}`,
            );
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
        const matchedPhone = await verifyConfirmation(
          cache,
          data.phoneConfirmCode,
          user.id,
          i18n,
        );
        if (matchedPhone) {
          const { email, phone } = classifyEmailPhone(matchedPhone);
          if ((email || phone) !== data.businessPhone) {
            logger.debug(
              `phone-confirmation-code matched: ${matchedPhone} but wrong phone`,
            );
            logger.debug(
              `confirm-code ${data.phoneConfirmCode} enteredPhone ${
                data.businessPhone
              } codedPhone ${phone}`,
            );
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
      };

      // NOTE: create retailer
      const retailer = await prisma.mutation.createRetailer({
        data: retailerData,
      });

      // NOTE: add role to user
      await prisma.mutation.updateUser({
        where: {
          id: user.id,
        },
        data: {
          assignment: {
            update: {
              retailers: {
                connect: {
                  id: retailer.id,
                },
              },
              roles: {
                connect: [
                  {
                    name: "RETAILER_OWNER",
                  },
                  {
                    name: "PRODUCT_OWNER",
                  },
                ],
              },
            },
          },
        },
      });

      // NOTE: open supportcase for approval
      const spCase = await prisma.mutation.createSupportCase({
        data: {
          subject: `Create/Update: ${retailer.businessName}`,
          status: {
            connect: {
              name: "OPEN",
            },
          },
          severity: {
            connect: {
              name: "MEDIUM",
            },
          },
          catergory: {
            connect: {
              name: "CREATE_RETAILER_APPROVAL",
            },
          },
          openedByUser: {
            connect: {
              id: user.id,
            },
          },
          targetIds: `${retailer.id}`,
        },
      });
      pubsub.publish(pubsubConfig.RETAILER_CREATED, {
        notificationFromRetailer: spCase,
      });

      return {
        userId: user.id,
        retailerId: retailer.id,
      };
    } catch (err) {
      logger.error(`🛑❌  REGISTER_RETAILER: ${err.message}`);
      const error = i18n._(t`Cannot register retailer`);
      throw new Error(error);
    }
  },

  updateRetailer: async (
    parent,
    { retailerId, data },
    { prisma, request, cache, i18n },
    info,
  ) => {
    try {
      // NOTE: check permission
      const user = await gatekeeper.checkPermissions(
        request,
        "UPDATE_RETAILER",
        retailerId,
      );

      const retailer = await prisma.query.retailer(
        {
          where: {
            id: retailerId,
          },
        },
        "{ id businessEmail businessPhone owner { user { id email phone }} }",
      );
      if (!retailer) {
        const error = i18n._(t`Retailer not found`);
      }

      // TODO: validate input

      // NOTE: verify email and phone
      if (data.businessEmail && data.businessEmail !== retailer.businessEmail) {
        if (data.businessEmail !== retailer.owner.user.email) {
          // email:
          const matchedEmail = await verifyConfirmation(
            cache,
            data.emailConfirmCode,
            user.id,
            i18n,
          );
          if (matchedEmail) {
            const { email, phone } = classifyEmailPhone(matchedEmail);
            if ((email || phone) !== data.businessEmail) {
              logger.debug(
                `email confirmation matched: ${matchedEmail} but wrong email`,
              );
              logger.debug(
                `code ${data.emailConfirmCode} enteredEmail ${
                  data.businessEmail
                } codedEmail ${email}`,
              );
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
          const matchedPhone = await verifyConfirmation(
            cache,
            data.phoneConfirmCode,
            user.id,
            i18n,
          );
          if (matchedPhone) {
            const { email, phone } = classifyEmailPhone(matchedPhone);
            if ((email || phone) !== data.businessPhone) {
              logger.debug(
                `email confirmation matched: ${matchedPhone} but wrong email`,
              );
              logger.debug(
                `code ${data.emailConfirmCode} enteredEmail ${
                  data.businessPhone
                } codedEmail ${email}`,
              );
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
        bankAccNumber: data.bankAccNumber || undefined,
        bankAccName: data.bankAccName || undefined,
        bankName: data.bankName || undefined,
        bankBranch: data.bankBranch || undefined,
        swiftCode: data.swiftCode || undefined,
      };

      // NOTE: update retailer
      const fragment = "{ fragment retailerIdForRetailer on Retailer { id } }";
      const updatedRetailer = await prisma.mutation.updateRetailer(
        {
          where: {
            id: retailerId,
          },
          data: updateData,
        },
        addFragmentToInfo(info, fragment),
      );

      // NOTE: open supportcase for approval
      const existedApproval = await prisma.query.supportCases({
        where: {
          AND: [
            { targetIds_contains: updatedRetailer.id },
            {
              category: {
                OR: [
                  {
                    name: "CREATE_RETAILER_APPROVAL",
                  },
                  {
                    name: "UPDATE_RETAILER_APPROVAL",
                  },
                ],
              },
            },
            {
              status: {
                name_contains: "OPEN",
              },
            },
          ],
        },
      });

      if (existedApproval) {
        await prisma.mutation.updateSupportCase({
          where: {
            id: existedApproval.id,
          },
          data: {
            catergory: {
              connect: {
                name: "UPDATE_RETAILER_APPROVAL",
              },
            },
            updatedByUser: {
              connect: {
                name: user.id,
              },
            },
          },
        });
      } else {
        await prisma.mutation.createSupportCase({
          data: {
            subject: `Create/Update: ${updatedRetailer.businessName}`,
            status: {
              connect: {
                name: "OPEN",
              },
            },
            severity: {
              connect: {
                name: "MEDIUM",
              },
            },
            catergory: {
              connect: {
                name: "UPDATE_RETAILER_APPROVAL",
              },
            },
            openedByUser: {
              connect: {
                id: user.id,
              },
            },
            targetIds: updatedRetailer.id,
          },
        });
      }

      return updatedRetailer;
    } catch (err) {
      logger.error(`🛑❌  UPDATE_RETAILER: ${err.message}`);
      const error = i18n._(t`Cannot update retailer`);
      throw new Error(error);
    }
  },

  // TODO: no need to check existed email
  // TODO: i18n
  resendRetailerConfirmationCode: async (
    parent,
    { emailOrPhone },
    { prisma, request, cache, i18n },
    info,
  ) => {
    // NOTE: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      "REGISTER_RETAILER",
      i18n,
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
      const code = generateConfirmation(cache, user.id, email);
      // sendConfirmationEmail("Seller", email, code);

      return true;
    }

    if (phone) {
      if (user && user.phone === phone) {
        const error = i18n._(t`Confirmed`);
        throw new Error(error);
      }
      const code = generateConfirmation(cache, user.id, phone);
      // sendConfirmationText("Seller", phone, code);
      // sendConfirmationEsms("Seller", phone, code);

      return true;
    }

    return false;
  },
};
