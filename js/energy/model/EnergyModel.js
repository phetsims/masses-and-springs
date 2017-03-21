// Copyright 2016-2017, University of Colorado Boulder

/**
 * Common model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  // constants
  var GRABBING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be connected to
                               // a spring
  var DROPPING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be released

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * TODO:: There has to be a better way to manage all of these properties as one entity without using propertySet()
   * @constructor
   */
  function EnergyModel( tandem ) {
    var self = this;

    MassesAndSpringsModel.call( this, tandem );

    this.velocityVectorVisibility = new BooleanProperty( false );

  }

  massesAndSprings.register( 'EnergyModel', EnergyModel );

  return inherit( MassesAndSpringsModel, EnergyModel );
} );