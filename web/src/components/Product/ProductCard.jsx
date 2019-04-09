import React, { useState, useEffect } from 'react';
import FlipPage from 'react-flip-page';
import Glider from 'glider-js';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  withStyles,
  IconButton,
  Icon,
  Link,
  CardMedia,
  Button,
  Zoom,
  Tooltip,
  SvgIcon,
} from '@material-ui/core';
import '../../utils/style/gliderjs.css';

const styles = theme => ({
  card: {
    position: 'relative',
    paddingBottom: 8,
    maxWidth: 220,
    zIndex: 1000,
    borderRadius: 10,
  },
  cardPrice: {
    marginLeft: theme.spacing.unit * 2,
  },
  rootIconButton: {
    padding: 0,
    color: '#ff512f',
    marginRight: 3,
  },
  title: {
    lineHeight: 0,
  },
  cardHeader: {
    paddingBottom: 0,
  },
  flexColumn: {
    position: 'relative',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    width: 'auto',
    justifyContent: 'space-between',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  img: {
    height: 200,
    width: '100%',
    objectFit: 'contain',
  },
  buttonContained: {
    borderRadius: 10,
    marginRight: 8,
    padding: '2px 4px',
  },
  iconButtonRoot: {
    marginRight: 8,
    padding: '2px 4px',
  },
  gliderContainer: {
    width: 220,
    height: 50,
  },
  tooltip: {
    fontSize: 16,
    zIndex: 10,
  },
  buttonFlipGuide: {
    position: 'absolute',
    top: 18,
    right: 0,
    zIndex: 10,
  },
});
const fitImage = { width: '100%', height: '50px', objectFit: 'contain' };
const listImage = [
  { src: 'https://picsum.photos/300/200/?image=0' },
  { src: 'https://picsum.photos/300/200/?image=1' },
  { src: 'https://picsum.photos/300/200/?image=2' },
  { src: 'https://picsum.photos/300/200/?image=3' },
  { src: 'https://picsum.photos/300/200/?image=4' },
];
const listImgRef = listImage.map(ele => {
  return { ...ele, ref: React.createRef() };
});
const ListProduct = withStyles(styles)(({ handleEnter, handleLeave, setActiveImg }) => {
  useEffect(() => {
    const glider = new Glider(document.querySelector('.glider-product-card'), {
      slidesToShow: 3,
      draggable: true,
      duration: 5,
      rewind: true,
    });
    setInterval(() => glider.scrollItem('next'), 2000);
  }, []); // Empty array is meaning the effect doesn depend on any values from props or state --> So it like componentDidMount and ...UnMount mental model
  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="glider-product-card"
      style={{ position: 'absolute', top: '150px', zIndex: 5, maxHeight: 50, width: 220 }}
    >
      {listImgRef.map((ele, i) => {
        return (
          <div
            ref={ele.ref}
            key={i}
            onClick={() => setActiveImg(ele.ref.current.querySelectorAll('img')[0].currentSrc)}
          >
            <img style={fitImage} src={ele.src} />
          </div>
        );
      })}
    </div>
  );
});

const CardPrice = withStyles(styles)(({ children, classes }) => {
  return (
    <div className={classes.cardPrice}>
      <div className={classes.flexBetween}>
        <Typography variant="body1">{children}</Typography>
      </div>
      <div className={classes.flexBetween}>
        <div className={classes.flexCenter}>
          <IconButton classes={{ root: classes.rootIconButton }}>
            <Icon>thumb_up_alt</Icon>
          </IconButton>
          <Typography variant="subtitle2">334</Typography>
        </div>
        <Button classes={{ contained: classes.buttonContained }} size="small" color="secondary" variant="contained">
          Add
        </Button>
      </div>
    </div>
  );
});

const ProductCard = ({ classes }) => {
  const [orientation, setOrien] = useState('vertical');
  const [openList, setOpen] = useState(false);
  const [activeImg, setActiveImg] = useState('https://picsum.photos/300/200/?image=0');
  const handleEnter = () => setOpen(true);
  const handleLeave = () => setOpen(false);
  const handleSetOrien = () => {
    if (orientation === 'vertical') {
      setOrien('horizontal');
    } else {
      setOrien('vertical');
    }
  };
  return (
    <Card className={classes.card}>
      {openList && (
        <Zoom in={openList}>
          <ListProduct setActiveImg={setActiveImg} handleEnter={handleEnter} handleLeave={handleLeave} />
        </Zoom>
      )}
      <Tooltip
        classes={{ tooltip: classes.tooltip }}
        placement="top"
        title={
          orientation === 'horizontal'
            ? 'Vui lòng lật sang trái để xem đánh giá của sản phẩm.'
            : 'Vui lòng lật từ dưới lên để biết thông tin chi tiết của sản phẩm. Click vào để chuyển sang chế độ Xem đánh giá của sản phẩm.'
        }
      >
        <IconButton
          className={classes.buttonFlipGuide}
          classes={{ root: classes.iconButtonRoot }}
          color="secondary"
          onClick={handleSetOrien}
        >
          {orientation === 'vertical' ? (
            <SvgIcon>
              <path d="M6,.5v23a.5.5,0,0,1-1,0V.5a.5.5,0,0,1,1,0Z" />
              <path d="M11,5.5a.47.47,0,0,1-.15.35.48.48,0,0,1-.7,0L5.5,1.21.85,5.85a.48.48,0,0,1-.7,0,.48.48,0,0,1,0-.7l5-5a.48.48,0,0,1,.7,0l5,5A.47.47,0,0,1,11,5.5Z" />
              <path d="M15,.5v23a.5.5,0,0,1-1,0V.5a.5.5,0,0,1,1,0Z" />
              <path d="M20,18.5a.47.47,0,0,1-.15.35l-5,5a.48.48,0,0,1-.7,0l-5-5a.49.49,0,0,1,.7-.7l4.65,4.64,4.65-4.64a.48.48,0,0,1,.7,0A.47.47,0,0,1,20,18.5Z" />
            </SvgIcon>
          ) : (
            <SvgIcon>
              <path d="M23.5,6H.5a.5.5,0,0,1,0-1h23a.5.5,0,0,1,0,1Z" />
              <path d="M18.5,11a.47.47,0,0,1-.35-.15.48.48,0,0,1,0-.7L22.79,5.5,18.15.85a.48.48,0,0,1,0-.7.48.48,0,0,1,.7,0l5,5a.48.48,0,0,1,0,.7l-5,5A.47.47,0,0,1,18.5,11Z" />
              <path d="M23.5,15H.5a.5.5,0,0,1,0-1h23a.5.5,0,0,1,0,1Z" />
              <path d="M5.5,20a.47.47,0,0,1-.35-.15l-5-5a.48.48,0,0,1,0-.7l5-5a.49.49,0,0,1,.7.7L1.21,14.5l4.64,4.65a.48.48,0,0,1,0,.7A.47.47,0,0,1,5.5,20Z" />
            </SvgIcon>
          )}
        </IconButton>
      </Tooltip>
      <FlipPage uncutPages orientation={orientation} width={220} height={385} showSwipeHint>
        <div className={classes.flexColumn}>
          <CardMedia
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className={classes.img}
            title="TIGI Bed Head Dumb Blonde Shampoo and Conditioner 750 ml"
            image={activeImg}
          />

          <CardHeader
            className={classes.cardHeader}
            title={
              <Typography className={classes.title} component={Link} color="primary" href="#">
                TIGI Bed Head Dumb Blonde Shampoo
              </Typography>
            }
            subheader={<Typography variant="subtitle2">by TIGI Head</Typography>}
          />

          <CardPrice handleSetOrien={handleSetOrien} orientation={orientation}>
            $100.00
          </CardPrice>
        </div>
        {orientation === 'vertical' ? (
          <CardContent>
            <Typography color="secondary">Description:</Typography>
            <Typography component="p">
              This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup
              of frozen peas along with the mussels, if you like.
            </Typography>
          </CardContent>
        ) : (
          <CardContent>
            <Typography color="secondary" gutterBottom>
              ✒️ Top Review:
            </Typography>
            <Typography color="primary">Minh Kha:</Typography>
            <Typography gutterBottom variant="subtitle2">
              &ldquo; This impressive paella is a perfect party dish and a fun meal to cook ...&rdquo;
            </Typography>
            <Typography color="primary">Kha Phan:</Typography>
            <Typography gutterBottom variant="subtitle2">
              &ldquo; This impressive paella is a perfect party dish and a fun meal to cook ...&rdquo;
            </Typography>
          </CardContent>
        )}
      </FlipPage>
    </Card>
  );
};

export default withStyles(styles)(ProductCard);
