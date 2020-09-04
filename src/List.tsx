import React, { useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import useInfiniteScroll from "./useInfiniteScroll";

interface IQuestion {
  tags: string[]
  owner: any
  creation_date: number
  title: string
  link: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2)
    }
  }),
);

const List = () => {
  const [listItems, setListItems] = useState<Array<any>>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion>();

  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

  const classes = useStyles();

  function fetchMoreListItems() {
    if (hasMore) {
      fetch(`https://api.stackexchange.com/2.2/questions?page=${pageNumber}&pagesize=${pageSize}&order=desc&sort=votes&site=stackoverflow`)
        .then(res => res.json())
        .then(res => {
          const updatedList = listItems.concat(res.items)
          setListItems(updatedList)
          setHasMore(res.has_more)
        })
        .catch(err => console.error(err))
      setIsFetching(false);
      setPageNumber(prevState => prevState + 1)
    }
  }

  const handleClickOpen = (listItem: any) => {
    setOpen(true);
    setSelectedQuestion(listItem)
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchMoreListItems()
    setPageSize(10)
  }, [])

  return (
    <>
      {listItems.map((listItem: IQuestion) => <React.Fragment>
        <Card variant="outlined" className={classes.root}>
          <CardContent>
            <Typography variant="h5" component="h2">{listItem?.title}</Typography>
            <Typography color="textSecondary">
              {listItem?.owner.display_name}
            </Typography>
            <Typography color="textSecondary">
              {new Date(listItem?.creation_date*1000).toLocaleDateString()}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleClickOpen(listItem)}>View More</Button>
          </CardActions>
        </Card>
      </React.Fragment>)}
      {isFetching && 'Fetching more list items...'}

      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle>
          <Typography>
            {selectedQuestion?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Link>
            {selectedQuestion?.link}
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default List;