import React from 'react';
import { Statistic, Divider, Form, Segment, Table } from "semantic-ui-react";
import { connect } from "react-redux";

import { fetchCountries, fetchStates, fetchCities, clearCities } from "../../../actions/locations";
import { 
  fetchNoAccounts, 
  fetchTotalNoAccounts, 
  fetchStatsByCountry,
  fetchStatsByState, 
  clearStatsByCountry,
  clearStatsByState
} from "../../../actions/adStatistics";
import { allCountryStats, allStateStats } from "../../../reducers/adStatistics";
import { 
  allCountriesSelector, 
  allStatesSelector, 
  allCitiesSelector
} from "../../../reducers/locations";
import AdMainPage from "./AdMainPage";

class AdDashboardPage extends React.Component {
  state = {
    data: {
      country: "",
      state: "",
      city: ""
    },
    loading: false
  }

  componentWillMount = () => {
    this.props.clearStatsByCountry();
    this.props.clearStatsByState();
    this.props.fetchCountries();
    this.props.fetchTotalNoAccounts();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.data.country !== this.state.data.country) {
      this.props.fetchStates(this.state.data.country);
      this.props.clearStatsByCountry();
      this.props.fetchStatsByCountry(this.state.data.country);
      this.props.clearCities();
    }

    if(prevState.data.state !== this.state.data.state) {
      this.props.clearStatsByState();
      this.props.fetchCities(this.state.data.country, this.state.data.state);
      this.props.fetchStatsByState(this.state.data.country, this.state.data.state);
    }

    if(prevState.data.city !== this.state.data.city) {
      this.props.fetchNoAccounts(this.state.data.country, this.state.data.state, this.state.data.city);
    }
  }

  handleLocationChange = (e, { name, value }) => 
    this.setState({
      data: { ...this.state.data, [name]: value }
    })

  onlogout = () => {
  	this.props.logout();
  }

  render() {
    const { 
      CountryOptions, 
      StateOptions, 
      CityOptions, 
      total_acc, 
      accounts, 
      countryStats,
      stateStats
    } = this.props;
    const { country, state, city } = this.state.data;
    const { loading } = this.state;

  	return (
  		<div>
  	    	<AdMainPage>
  	    		<h1>Statistics</h1>
            <Divider />
            <div style={{ textAlign: "center" }}>
              <Statistic>
                <Statistic.Value>{total_acc || 0}</Statistic.Value>
                <Statistic.Label>Total Accounts</Statistic.Label>
              </Statistic>
            </div>
            
            <Divider />

            <h4>By Location</h4>
            <Form>
              <Form.Group>
                <Form.Dropdown 
                  placeholder="Country" 
                  width={5}
                  search
                  selection 
                  value={country}
                  onChange={this.handleLocationChange}
                  name="country"
                  options={CountryOptions}
                />
                <Form.Dropdown 
                  placeholder="State" 
                  width={5} 
                  search
                  onChange={this.handleLocationChange}
                  value={state}
                  name="state"
                  selection 
                  options={StateOptions}
                />
                <Form.Dropdown 
                  placeholder="Location" 
                  width={6}
                  search 
                  onChange={this.handleLocationChange}
                  value={city}
                  name="city"
                  selection
                  options={CityOptions}
                />
              </Form.Group>
            </Form>
            <br />
            <Segment textAlign="center" style={{ background: '#f6f6f6' }}>
              { loading ? (
                <p>Loading...</p>
              ) : (
                city ? (
                  <div style={{ textAlign: "center" }}>
                    <h5>{country}</h5>
                    <h5>{state}</h5>
                    <h5>{city}</h5>
                    <Statistic horizontal label="Accounts" value={accounts}/>
                  </div>
                ) : (
                  <div>Select any location.</div>
                )
              )}
            </Segment>

            <Divider />

            <h4>By State</h4>
            <Form>
              <Form.Group>
                <Form.Dropdown 
                    placeholder="Country" 
                    width={5}
                    search
                    selection 
                    value={country}
                    onChange={this.handleLocationChange}
                    name="country"
                    options={CountryOptions}
                  />
                  <Form.Dropdown 
                    placeholder="State" 
                    width={5} 
                    search
                    onChange={this.handleLocationChange}
                    value={state}
                    name="state"
                    selection 
                    options={StateOptions}
                  />
                </Form.Group>
            </Form>
            <Segment style={{ background: '#f6f6f6' }}>
              <h4>{country}</h4>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>S.No</Table.HeaderCell>
                      <Table.HeaderCell>City</Table.HeaderCell>
                      <Table.HeaderCell>No of Accounts</Table.HeaderCell>
                    </Table.Row>  
                  </Table.Header>
                  <Table.Body>
                    {stateStats && stateStats.map((stat, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{i+1}</Table.Cell>
                        <Table.Cell>{stat.label}</Table.Cell>
                        <Table.Cell>{stat.value}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
            </Segment>

            <Divider />

            <h4>By Country</h4>
            <Form>
              <Form.Dropdown 
                placeholder="Country" 
                width={5}
                search
                selection 
                fluid
                value={country}
                onChange={this.handleLocationChange}
                name="country"
                options={CountryOptions}
              />
            </Form>
            <Segment style={{ background: '#f6f6f6' }}>
              <h4>{country}</h4>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>S.No</Table.HeaderCell>
                      <Table.HeaderCell>State</Table.HeaderCell>
                      <Table.HeaderCell>No of Accounts</Table.HeaderCell>
                    </Table.Row>  
                  </Table.Header>
                  <Table.Body>
                    {countryStats && countryStats.map((stat, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{i+1}</Table.Cell>
                        <Table.Cell>{stat.label}</Table.Cell>
                        <Table.Cell>{stat.value}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
            </Segment>

  	    	</AdMainPage>	
  		</div>
    );
  }
  
}

function mapStateToProps(state) {
  return {
    CountryOptions: allCountriesSelector(state),
    StateOptions: allStatesSelector(state),
    CityOptions: allCitiesSelector(state),
    total_acc: state.adStatistics.total_acc,
    accounts: state.adStatistics.accounts,
    countryStats: allCountryStats(state),
    stateStats: allStateStats(state)
  }
}

export default connect(
  mapStateToProps, 
  {
    fetchCountries,
    fetchStates,
    fetchCities,
    clearCities,
    fetchTotalNoAccounts,
    fetchNoAccounts,
    fetchStatsByCountry,
    clearStatsByCountry,
    fetchStatsByState,
    clearStatsByState
  }
)(AdDashboardPage);