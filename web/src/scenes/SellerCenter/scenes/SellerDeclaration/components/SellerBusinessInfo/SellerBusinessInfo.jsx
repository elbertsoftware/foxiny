import React, { useState, useEffect } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Button,
  withStyles,
  Grid,
  Icon,
  IconButton
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { toast } from "react-toastify";
import { compose, graphql } from "react-apollo";
import { Form } from "react-final-form";
import TabContainer from "../../../../../../components/TabContainer/TabContainer";
import peopleImage from "../../../../../../images/people-fill-out-form.jpg";
import UploadFileZone from "../../../../../../components/UploadFileZone/UploadFileZone";
import sellerDeclarationStyles from "../../styles/sellerDeclarationStyles";
import {
  UPLOAD_SOCIAL_ID_MEDIA,
  DELETE_SOCIAL_ID_MEDIA
} from "../../../../../../utils/graphql/retailer";
import ApprovalContainer from "../../../../../../components/ApproveContainer/ApprovalContainer";
import ReactMediumZoom from "../../../../../../components/MediumZoom/ReactMediumZoom";
import AddBankAccount from "../AddBankAccount/AddBankAccount";
import Paper from "../../../../../../components/Paper/Paper";

const imgCardStyles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: 200,
    maxHeight: 240,
    margin: "0 16px"
  },
  imageContainer: {
    overflow: "hidden",
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
    transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
    borderRadius: theme.spacing.unit * 2,
    "&:hover": {
      transform: "scale(1.04)",
      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)"
    }
  },
  fitImage: {
    width: 200,
    height: 200,
    objectFit: "contain",
    zIndex: 150
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    transform: "translate(16px, 24px)",
    zIndex: 10
  },
  closeIcon: {
    padding: 8,
    backgroundColor: "rgb(245, 245, 245)"
  }
});

const ImageCardReview = withStyles(imgCardStyles)(
  ({ src, classes, removeItem, ...others }) => {
    return (
      <div className={classes.container}>
        <div className={classes.buttonContainer}>
          <IconButton onClick={removeItem} className={classes.closeIcon}>
            <Icon>close</Icon>
          </IconButton>
        </div>
        <Paper elevation={0} className={classes.imageContainer}>
          <ReactMediumZoom
            container="#sellerBusinessContainer"
            className={classes.fitImage}
            src={src}
            alt="review"
          />
        </Paper>
      </div>
    );
  }
);

const SellerBusinessInfo = ({ classes, theme, seller, review, ...props }) => {
  // from Graphql
  const { uploadSocialIDMediaRetailer, deleteSocialIDMediaRetailer } = props;
  const [activeTabId, setActiveTabId] = useState(0);
  const [images, setImages] = useState([]);
  const [socialIDMedias, setSocialIDMedias] = useState([]);
  const [deleteIds, setDeleteIds] = useState([]);
  const [isRejected, setRejected] = useState(false);
  const onDropAccepted = acceptedFiles => {
    setRejected(false);
    let listFiles = [];
    if (images.length > 0) {
      const listAddedPreview = acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      listFiles = listFiles.concat(images, listAddedPreview);
      console.log(listFiles);
      // setFiles(listFiles);
      setImages(listFiles);
      return;
    }
    const fileList = acceptedFiles.map(file =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages(fileList);
  };

  const onDropRejected = React.useCallback(() => {
    setRejected(true);
  });
  useEffect(() => {
    if (seller) {
      setSocialIDMedias(seller.socialNumberImages);
    }
  }, [seller]);
  const handleTabChange = (e, id) => {
    setActiveTabId(id);
  };
  const handleChangeIndex = index => {
    setActiveTabId(index);
  };

  const removeItem = (index, forSocialMedias) => () => {
    if (!forSocialMedias) {
      const newImages = images.filter((image, i) => i !== index);
      setImages(newImages);
    } else {
      const newImages = socialIDMedias.filter((image, i) => i !== index);
      setSocialIDMedias(newImages);
    }
  };

  const addDeletedId = id => {
    setDeleteIds(deleteIds.concat(id));
  };
  const uploadSocialIDOrBusinessLicense = async () => {
    try {
      if (socialIDMedias.length > 0) {
        await deleteSocialIDMediaRetailer({
          variables: {
            sellerId: seller.id,
            fileIds: deleteIds
          }
        });
      }
      if (images.length === 2) {
        const {
          data: {
            uploadSocialIDMediaRetailer: [ids]
          }
        } = await uploadSocialIDMediaRetailer({
          variables: {
            sellerId: seller.id,
            files: images
          }
        });
        if (ids) {
          toast.success("Lưu thành công.");
        }
      } else if (images.length !== 0) {
        toast.warn("Vui lòng tải lên hai mặt CMND của bạn.");
      }
      window.location.reload();
    } catch (error) {
      toast.error(
        error.message.replace("GraphQL error:", "") || "Có lỗi xảy ra!"
      );
    }
  };
  const onSubmit = async values => {};
  return (
    <Paper id="sellerBusinessContainer" className={`${classes.wrapper}`}>
      <Typography className={classes.title}>
        Thông tin tài khoản bán hàng
      </Typography>
      <Typography
        align="center"
        className={classes.subtitle}
        variant="subtitle2"
      >
        Vui lòng cung cấp những thông tin cần thiết tùy theo loại hình kinh
        doanh mà bạn đã đăng ký trước đó. Đây là những thông tin để chúng tôi có
        thể xác thực tài khoản bán hàng của bạn
      </Typography>
      <div className={classes.wrapContent}>
        <div className={classes.logoContainer}>
          <img
            className={classes.logoImage}
            src={peopleImage}
            alt="fill-information"
          />
        </div>
        <div className={classes.formContainer}>
          <Tabs
            className={classes.tabContainer}
            value={activeTabId}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Thông tin" classes={{ root: classes.tab }} />
            <Tab label="Tài khoản ngân hàng" classes={{ root: classes.tab }} />
          </Tabs>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={activeTabId}
            onChangeIndex={handleChangeIndex}
          >
            {activeTabId === 0 ? (
              <TabContainer
                className={classes.swipeContainer}
                dir={theme.direction}
              >
                <Typography className={classes.heading} variant="h3">
                  <strong>Cá nhân</strong>
                </Typography>
                <Typography gutterBottom>
                  Tải ảnh CMND của bạn bao gồm mặt trước và mặt sau.
                </Typography>
                <Paper
                  elevation={0}
                  className={classes.notify}
                  background="main"
                >
                  <Typography variant="h6">
                    Yêu cầu đối với hình ảnh:{" "}
                  </Typography>
                  <Typography variant="subtitle2">
                    Kích thước tối thiểu 500 x 500px
                  </Typography>
                </Paper>
                <UploadFileZone
                  style={classes.uploadZone}
                  onDropAccepted={onDropAccepted}
                  onDropRejected={onDropRejected}
                  isRejected={isRejected}
                  maxSize={3000000}
                  fileTypes={[
                    "image/jpeg",
                    "image/png",
                    "image/svg",
                    "application/pdf"
                  ]}
                />

                <Grid
                  className={classes.gridContainer}
                  wrap="nowrap"
                  container
                  spacing={2}
                >
                  {images &&
                    images.map((image, index) => (
                      <Grid key={image.path} item>
                        {image.type.includes("application") ? (
                          <Typography align="center">
                            📁 {`${image.path} (${image.size}KB)`}{" "}
                          </Typography>
                        ) : (
                          <ImageCardReview
                            src={image.preview}
                            removeItem={removeItem(index)}
                          />
                        )}
                      </Grid>
                    ))}
                  {socialIDMedias.map((image, index) => (
                    <Grid key={image.id} item>
                      <ApprovalContainer
                        review={review}
                        name={`checkSocialIDMedia${index}`}
                      >
                        <ImageCardReview
                          src={image.uri}
                          removeItem={() => {
                            removeItem(index, true)();
                            addDeletedId(image.id);
                          }}
                        />
                      </ApprovalContainer>
                    </Grid>
                  ))}
                </Grid>
              </TabContainer>
            ) : (
              /* Avoiding raise invalid child: null error from react-swipe-view */
              <Typography />
            )}
            {activeTabId === 1 ? (
              <TabContainer
                className={classes.swipeContainer}
                dir={theme.direction}
              >
                <AddBankAccount />
              </TabContainer>
            ) : (
              <Typography />
            )}
          </SwipeableViews>
          <div className={classes.buttonContainer}>
            <Button
              onClick={uploadSocialIDOrBusinessLicense}
              variant="contained"
              color="secondary"
              className={classes.buttonAction}
            >
              Lưu
            </Button>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default compose(
  graphql(UPLOAD_SOCIAL_ID_MEDIA, { name: "uploadSocialIDMediaRetailer" }),
  graphql(DELETE_SOCIAL_ID_MEDIA, { name: "deleteSocialIDMediaRetailer" }),
  withStyles(sellerDeclarationStyles, { withTheme: true })
)(SellerBusinessInfo);
