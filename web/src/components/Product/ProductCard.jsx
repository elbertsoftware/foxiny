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
} from '@material-ui/core';
import '../../utils/style/gliderjs.css';

const styles = theme => ({
  card: {
    position: 'relative',
    paddingBottom: 8,
    maxWidth: 220,
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
  gliderContainer: {
    width: 220,
    height: 50,
  },
  tooltip: {
    fontSize: 16,
  }
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
const ListProduct = withStyles(styles)(({ classes, handleEnter, handleLeave, setActiveImg }) => {
  useEffect(() => {
    const glider = new Glider(document.querySelector('.glider-product-card'), {
      slidesToShow: 3,
      draggable: true,
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

const CardPrice = withStyles(styles)(({ children, classes, handleSetOrien, orientation }) => {
  return (
    <div className={classes.cardPrice}>
      <div className={classes.flexBetween}>
        <Typography variant="body1">{children}</Typography>
        <Tooltip classes={{tooltip: classes.tooltip}} placement="top" title={orientation === 'vertical' ? 'Vui lòng lật sang trái để xem đánh giá của sản phẩm' : 'Vui lòng lật từ dưới lên để biết thông tin chi tiết của sản phẩm'} >
          <Button classes={{ textSecondary: classes.buttonContained }} color="secondary" onClick={handleSetOrien}>
            {orientation === 'vertical' ? '⬅' : '⬆'}
          </Button>
        </Tooltip>
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
