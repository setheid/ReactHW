'use strict';

var counter = 1;
// mock database
var data = {
  user: 'Alfred',
  password: 'password',
  reviews: [{_id: 'id0', coffee: 'Sample Coffee', review: 'Loved it!', notes: 'bold, nutty, blah, blah...', stars: 5}]
}

var App = React.createClass({
  getInitialState: function() {
    return {loggedin: false, reviews: this.props.data.reviews}
  },
  login: function() {
    this.setState({loggedin: true});
  },
  handleReviewSubmit: function(review) {
    this.props.data.reviews.push(review);
    this.setState({reviews: this.props.data.reviews});
  },
  handleReviewUpdate: function(review) {
    this.props.data.reviews = this.props.data.reviews.map(ele => {
      if (ele._id === review._id) return review;
      else return ele;
    });
    this.setState({reviews: this.props.data.reviews});
  },
  handleDelete: function(id) {
    this.props.data.reviews = this.props.data.reviews.filter(ele => ele._id != id);
    this.setState({reviews: this.props.data.reviews});
  },
  render: function() {
    return (
      <main>
        <h1>Coffee Notes</h1>
        <LoginForm data={this.props.data} login={this.login} loggedin={this.state.loggedin} />
        <OverView
          data={this.props.data}
          deleteReview={this.handleDelete}
          onUpdate={this.handleReviewUpdate}
          reviews={this.state.reviews}
          loggedin={this.state.loggedin}
        />
        <Notes loggedin={this.state.loggedin} onReviewSubmit={this.handleReviewSubmit} />
      </main>
    );
  }
});

var LoginForm = React.createClass({
  getInitialState: function() {
    return {user: '', password: ''};
  },
  handleUserChange: function(e) {
    this.setState({user: e.target.value});
  },
  handlePasswordChange: function(e) {
    this.setState({password: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var user = this.state.user.trim();
    var password = this.state.password.trim();
    if (!user || !password) {
      return this.setState({user: '', password: ''});
    };

    // TODO: send request to the server

    // in Response Callback:
    if (user != this.props.data.user && password != this.props.data.password) {
      return this.setState({user: '', password: ''});
    }
    this.props.login();
    this.props.data.loggedin = true;
    this.setState({user: '', password: ''});
  },
  render: function() {
    return (
      <section className={this.props.loggedin ? 'hidden' : ''}>
        <h1>Please Login</h1>
        <span>(hint: use 'Alfred' and 'password')</span>
        <form className="loginForm" onSubmit={this.handleSubmit}>
        <input
        type="text"
        placeholder="Your username"
        value={this.state.user}
        onChange={this.handleUserChange}
        />
        <input
        type="password"
        placeholder="Your password"
        value={this.state.password}
        onChange={this.handlePasswordChange}
        />
        <input type="submit" value="Post" />
        </form>
      </section>
    );
  }
});

var OverView = React.createClass({
  getInitialState: function() {
    return {user: this.props.data.user, password: this.props.data.password};
  },
  render: function(){
    return (
      <section className={this.props.loggedin ? '' : 'hidden'}>
        <h1>Welcome {this.props.data.user}</h1>
        <h3>Overview</h3>
        <p>
          Here is an overview of your coffee notes. Edit notes or add a new coffee below.
        </p>
        <ReviewList
          deleteReview={this.props.deleteReview}
          onUpdate={this.props.onUpdate}
          reviews={this.props.reviews}
        />
      </section>
    );
  }
});

var ReviewList = React.createClass({
  render: function() {
    var reviewNodes = this.props.reviews.map(ele => {
      return (
        <Review
          onUpdate={this.props.onUpdate}
          deleteReview={this.props.deleteReview}
          coffee={ele.coffee}
          review={ele.review}
          notes={ele.notes}
          stars={ele.stars}
          _id={ele._id}
          key={ele._id}
        />
      )
    });
    return (
      <div className="reviewList">
        {reviewNodes}
      </div>
    );
  }
});

var Review = React.createClass({
  getInitialState: function() {
    return {makeEdit: false};
  },
  handleEdit: function(e) {
    e.preventDefault();
    var set = !this.state.makeEdit;
    this.setState({makeEdit: set, coffee: '', review: '', notes: '', stars: ''});
  },
  handleCoffeeChange: function(e) {
    this.setState({coffee: e.target.value});
  },
  handleReviewChange: function(e) {
    this.setState({review: e.target.value});
  },
  handleNotesChange: function(e) {
    this.setState({notes: e.target.value});
  },
  handleStarsChange: function(e) {
    this.setState({stars: e.target.value});
  },
  handleUpdate: function(e) {
    e.preventDefault();
    var updateReview = {
      _id: this.props._id,
      coffee: this.state.coffee ? this.state.coffee.trim() : this.props.coffee,
      review: this.state.review ? this.state.review.trim() : this.props.review,
      notes: this.state.notes ? this.state.notes.trim() : this.props.notes,
      stars: this.state.stars ? this.state.stars : this.props.stars
    }

    // TODO: send request to the server

    // in Response Callback:
    this.props.onUpdate(updateReview);
    this.setState({makeEdit: false, coffee: '', review: '', notes: '', stars: ''});
  },
  handleDelete: function(e) {
    e.preventDefault();

    // TODO: send request to the server

    this.props.deleteReview(this.props._id);
    this.setState({makeEdit: false});
  },
  render: function() {
    return (
      <article>
        <h3>{this.props.coffee}</h3>
          <input className={this.state.makeEdit ? '' : 'hidden'}
          type="text"
          placeholder="Edit Coffee Name"
          value={this.state.coffee}
          onChange={this.handleCoffeeChange}
          />
        <span>{this.props.stars} Stars</span>
          <input className={this.state.makeEdit ? '' : 'hidden'}
          type="number"
          min="0" max="5"
          value={this.state.stars}
          onChange={this.handleStarsChange}
          />
        <h4>Review</h4>
        <p>{this.props.review}</p>
          <input className={this.state.makeEdit ? '' : 'hidden'}
          type="text"
          placeholder="Edit Review"
          value={this.state.review}
          onChange={this.handleReviewChange}
          />
        <h4>Tasting Notes</h4>
        <p>{this.props.notes}</p>
          <input className={this.state.makeEdit ? '' : 'hidden'}
          type="text"
          placeholder="Edit Tasting Notes"
          value={this.state.notes}
          onChange={this.handleNotesChange}
          />
        <button onClick={this.handleEdit}>{this.state.makeEdit ? 'Cancel' : 'Edit'}</button>
        <form className="edit" className={this.state.makeEdit ? '' : 'hidden'}>
          <button onClick={this.handleUpdate}>Update</button>
          <button onClick={this.handleDelete}>Delete</button>
        </form>
      </article>
    );
  }
});

var Notes = React.createClass({
  getInitialState: function() {
    return {coffee: '', review: '', notes: '', stars: ''}
  },
  handleCoffeeChange: function(e) {
    this.setState({coffee: e.target.value});
  },
  handleReviewChange: function(e) {
    this.setState({review: e.target.value});
  },
  handleNotesChange: function(e) {
    this.setState({notes: e.target.value});
  },
  handleStarsChange: function(e) {
    this.setState({stars: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var newReview = {
      coffee: this.state.coffee.trim(),
      review: this.state.review.trim(),
      notes: this.state.notes.trim(),
      stars: this.state.stars
    }

    // TODO: send request to the server

    // in Response Callback:
    newReview._id = 'id' + counter++;
    this.props.onReviewSubmit(newReview);
    this.setState({coffee: '', review: '', notes: '', stars: ''});
  },
  render: function() {
    return (
      <section className={this.props.loggedin ? '' : 'hidden'}>
        <h1>Add a Coffee</h1>
        <form onSubmit={this.handleSubmit}>
          Coffee Name: <br/>
            <input
            type="text"
            value={this.state.coffee}
            onChange={this.handleCoffeeChange}
            /><br/>
          Your Impressions: <br/>
            <input
            type="text"
            value={this.state.review}
            onChange={this.handleReviewChange}
            /><br/>
          Tasting Notes: <br/>
            <input
            type="text"
            value={this.state.notes}
            onChange={this.handleNotesChange}
            /><br/>
          Stars: <br/>
            <input
            type="number"
            min="0" max="5"
            value={this.state.stars}
            onChange={this.handleStarsChange}
            /><br/>
          <input type="submit" value="Post" />
        </form>
      </section>
    );
  }
});

ReactDOM.render(
  <App data={data} />,
  document.getElementById('content')
);
