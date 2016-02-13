// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  //var Spring = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Spring' );
  var Mass = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Mass' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function SpringMassSystem( spring, options ) {

    options = _.extend( {
      frictionRange: new Range( 0, Math.pow( 1.5, 10 ) * .1 - .1, ( Math.pow( 1.5, 10 ) * .1 - .1 ) / 2. ), // {number} b
      gravity: 9.8 // {number} g
    }, options );

    // validate and save options
    assert && assert( spring, 'SpringMassSystem must have a spring' );
    this.spring = spring; // @public read-only

    assert && true; //TODO: establish assertion for friction range, maybe this shouldn't be set in options?
    this.frictionRange = options.frictionRange;


    //------------------------------------------------
    // Properties

    PropertySet.call( this, {
      // @private
      lastDt: 0, // {number} last time step, needed for heat DerivedProperty
      // @public
      friction: this.frictionRange.defaultValue,
      gravity: options.gravity,
      mass: new Mass(  ), // {Mass} attached mass reference
      velocity: 0, // {number} v velocity of mass(body) always initialized to zero
      period: 0 // {number} period of system, zero until a mass is added
    }, options );

    //------------------------------------------------
    // Derived properties
    this.accelerationProperty = new DerivedProperty( [ this.gravityProperty, this.spring.springConstantProperty, this.mass.valueProperty, this.spring.displacementProperty, this.frictionProperty, this.velocityProperty ],
      function( g, k, m, y, b, v) {
        return g - ( k / m ) * y - b * v;
      } );

    this.kineticEnergyProperty = new DerivedProperty( [ this.mass.valueProperty, this.velocityProperty ],
      function( m, v ) {
        return 0.5 * m * v * v;
      } );

    this.potentialEnergyElasProperty = new DerivedProperty( [ this.spring.springConstantProperty, this.spring.displacementProperty ],
      function( k, y ) {
        return 0.5 * k * y * y;
      } );

    //TODO: implement stageheight and scale
    this.potentialEnergyGravProperty = new DerivedProperty( [ this.mass.valueProperty, this.gravityProperty, this.spring.topProperty ],
      function( m, g, h ) {
        //return m * g * ( this.stageHeight / this.scale - h );
        return m * g * ( h );
      } );

    this.heatProperty = new DerivedProperty( [ this.lastDtProperty, this.mass.valueProperty, this.frictionProperty, this.velocityProperty, this.accelerationProperty ],
      function( dt, m, b, v, a ) {
        var deltaY = v * dt +  a * dt * dt * 0.5;
        var postVelocity = v + a * dt;
        return deltaY * m * b * postVelocity;
      } );

    this.totalEnergyProperty = new DerivedProperty( [ this.kineticEnergyProperty, this.potentialEnergyElasProperty, this.potentialEnergyGravProperty, this.heatProperty ],
      function( ke, peelas, pegrav, q ) {
        return ke + peelas + pegrav + q;
      } );


    //------------------------------------------------
    // Property observers

  }

  massesAndSprings.register( 'SpringMassSystem', SpringMassSystem );

  return inherit( PropertySet, SpringMassSystem, {
    /**
     * Animation step function
     *
     * @param dt
     */
    step: function( dt ) {
      //TODO: handle this in an observer pattern
      if ( this.mass && this.mass.userControlled ) {
        this.spring.displacement = this.mass.position.y;
        this.velocity = 0;
        this.spring.animating = false;
      }
      else if ( this.spring.animating && this.mass && !this.mass.userControlled ) {
        //if ( dt > this.period / 15 ) {
        //  dt = this.period / 15;
        //}
        this.lastDt = dt; //Update heat value
        this.spring.displacement = this.spring.displacement + this.velocity * dt + this.acceleration * dt * dt * 0.5;
        //this.mass.position.y = this.spring.bottom; //TODO REPLACE W/ LINK OR LISTENER
      }
    },

    /**
     * Attach a mass to the spring and start oscillation.
     * Will not replace mass on a spring already in motion
     *
     * @param mass {Mass} mass that sets the spring in motion
     */
    addMass: function( mass ) {
      if ( !this.animating ) {
        mass.release();
        this.period = 2 * Math.PI * Math.sqrt( this.mass.value / this.spring.springConstant );
        mass.onSpring = true;
        this.mass = mass;
        this.spring.displacement = this.spring.displacementRange.max;
        //this.mass.position.y = this.spring.bottom; //TODO REPLACE W/ LINK OR LISTENER
        //this.spring.animating = true;
      }
    },

    /**
     * Removes mass from the spring, returns spring to equilibrium, stop animation.
     */
    removeMass: function() {
      this.mass.reset();
      var k = this.spring.springConstant;
      this.spring.reset();
      this.spring.springConstant = k;
      this.mass = new Mass();
      this.velocity = 0;
      this.period = 0;
    },

    /**
     * Reset all.
     */
    reset: function() {
      this.mass.reset();
      this.spring.reset();
      this.mass = new Mass();
      this.velocity = 0;
      this.period = 0;
    }
  } );

} );
