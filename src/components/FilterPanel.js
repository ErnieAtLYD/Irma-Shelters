import React, { Component } from 'react';
import moment from 'moment';
import '../App.css';
import ExternalLinks from './ExternalLinks';

class FilterPanel extends Component {
  state = {
    isActive: false,
    selectedFilter: {
      allShelters: false,
      acceptingPeople: true,
      notAccepting: false,
      pets: false,
      updated: false
    }
  }

  componentDidMount() {
    // Show Panel on page load if not on mobile
    window.innerWidth > 600 && ( this.handleTogglePanel() )

  }

  handleFilter = (value, origMarkers) => {
    const { onClickFilter } = this.props;

    this.setState({
      selectedFilter: {
        allShelters: value === "All Shelters",
        acceptingPeople: value === "Accepting People",
        notAccepting: value === "Not Accepting People",
        pets: value === "Accepting Pets",
        updated: value.indexOf('Updated') > -1
      }
    })

    let filtered;
    value === "All Shelters" && (filtered = origMarkers)
    value === "Accepting People" && (filtered = origMarkers.filter(marker => (marker.accepting)))
    value === "Not Accepting People" && (filtered = origMarkers.filter(marker => (!marker.accepting)))
    value === "Accepting Pets" && (filtered = origMarkers.filter(marker => (marker.pets.length > 0 && marker.pets.match(/yes/ig))))
    value.indexOf('Updated') > -1 && (filtered = origMarkers.filter(marker => {
      if (marker.lastUpdated.length > 0) {
        const replaceLastUpdated = moment(marker.lastUpdated, 'YYYY-MM-DD hh:mm A').add(12, 'hours').format()
        const timeAfter = moment().format()
        return replaceLastUpdated > timeAfter && (marker)
      }
    }))

    onClickFilter(value, filtered)

    // If on mobile, then close on filter click
    window.innerWidth < 600 && ( this.handleTogglePanel() )
  }

  handleTogglePanel = () => {
    this.setState({
      isActive: !this.state.isActive
    })
  }

  render() {
    const { OGMarkers, toggledInfo } = this.props;
    const { isActive, selectedFilter } = this.state;
    const {
      allShelters,
      acceptingPeople,
      notAccepting,
      pets,
      updated } = selectedFilter;
      return (
        <div className={ toggledInfo ? 'hideTopButtons filterComponent' : 'filterComponent' }>
          <input
            type='button'
            value={ isActive ? 'Hide Panel' : 'Show Panel'}
            className='togglePanelButton'
            onClick={this.handleTogglePanel} />
          <div className={ isActive ? 'filterPanel' : 'filterPanel closePanel' }>
            <ExternalLinks />
            <hr/>
            <div className='title'>Filter Shelters</div>
            <input
              type='button'
              value='All Shelters'
              className={ allShelters ? 'blueButton selected' : 'blueButton' }
              onClick={(e) => {this.handleFilter(e.target.value, OGMarkers)}}/>
            <input
              type='button'
              value='Accepting People'
              className={ acceptingPeople ? 'blueButton selected' : 'blueButton' }
              onClick={(e) => {this.handleFilter(e.target.value, OGMarkers)}}/>
            <input
              type='button'
              value='Not Accepting People'
              className={ notAccepting ? 'blueButton selected' : 'blueButton' }
              onClick={(e) => {this.handleFilter(e.target.value, OGMarkers)}}/>
            <input
              type='button'
              value='Accepting Pets'
              className={ pets ? 'blueButton selected' : 'blueButton' }
              onClick={(e) => {this.handleFilter(e.target.value, OGMarkers)}}/>
            <input
              type='button'
              value='Updated within the last 12 hours'
              className={ updated ? 'blueButton selected' : 'blueButton' }
              onClick={(e) => {this.handleFilter(e.target.value, OGMarkers)}}/>
          </div>
        </div>
      )
  }
}

export default FilterPanel
