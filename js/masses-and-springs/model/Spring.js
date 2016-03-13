// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  // module
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Complex = require( 'DOT/Complex' );

  /**
   * @param {Vector2} position - coordinates of the top center of the spring
   * @param {number} naturalRestingLength - resting length of unweighted spring in m
   * @param {Range} springConstantRange - k in N/m
   *
   * @constructor
   */
  function Spring( position, naturalRestingLength, springConstantRange ) {
    //var self = this;

    // validate and save options
    assert && assert( naturalRestingLength > 0, 'naturalRestingLength must be > 0 : ' + naturalRestingLength );
    this.naturalRestingLength = naturalRestingLength; // @public read-only

    assert && assert( springConstantRange.min > 0, 'minimum spring constant must be positive : '
                                                   + springConstantRange.min );
    this.springConstantRange = springConstantRange; // @public read-only

    //------------------------------------------------
    // Properties
    PropertySet.call( this, {
      gravity: 9.8, // {number} units m/s^2
      displacement: 0,  // {number} units: m
      springConstant: springConstantRange.defaultValue,  // {number} units N/m
      dampingCoefficient: 0, // {number} units N.s/m - viscous damping coefficient of the system
      position: position, // {Vector2} units ( m, m )
      naturalRestingLength: naturalRestingLength, // {number} units: m
      animating: false, // {boolean}
      mass: null // {Mass}
    } );

    //------------------------------------------------
    // Derived properties


    // @public length of the spring, units = m
    this.lengthProperty = new DerivedProperty( [ this.naturalRestingLengthProperty, this.displacementProperty ],
      function( naturalRestingLength, displacement ) {
        return naturalRestingLength - displacement;
      } );

    // @public y position of the bottom end of the spring, units = m
    this.bottomProperty = new DerivedProperty( [ this.positionProperty, this.lengthProperty ],
      function( position, length ) {
        return position.y - length;
      } );
    //------------------------------------------------
    // Property observers

    // k: When spring constant changes, adjust either displacement or applied force
    // TODO:: This may not be neccessary because k is handled in the oscillate function
    //this.springConstantProperty.link( function( springConstant ) {
    //  assert && assert( self.springConstantRange.contains( springConstant ), 'springConstant is out of range: ' + springConstant );
    //  // TODO: calculate displacement and/or period based on attached mass and new spring constant
    //  // self.displacement = self.appliedForce / springConstant; // x = F/k
    //} );
  }

  massesAndSprings.register( 'Spring', Spring );

  return inherit( PropertySet, Spring, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.removeMass();
    },

    /**
     * @public
     */
    removeMass: function() {
      if ( this.mass ) {
        this.mass.detach();
      }
      //ensures displacement will change on reset, otherwise springs will be upside down.
      // TODO: find a better fix for this problem.
      this.displacement += 1;
      PropertySet.prototype.reset.call( this );
    },

    /**
     * @public
     *
     * @param {Mass} mass
     */
    addMass: function( mass ) {
      this.mass = mass;
      this.mass.spring = this;
      this.displacement = this.mass.position.y - ( this.position.y - this.naturalRestingLength );
      this.mass.verticalVelocity = 0;
      this.animating = true;
    },

    /**
     * @public
     *
     * @param {number} dt - animation time step
     */
    oscillate: function( dt ) {
      if ( this.mass && !this.mass.userControlled && this.animating ) {
        //TODO:: implement upper limit for dt
        var k = this.springConstant;
        var m = this.mass.mass;
        var c = this.dampingCoefficient;
        var v = this.mass.verticalVelocity;
        var x = this.displacement;
        var g = this.gravity;

        // Underdamped and Overdamped case
        if ( ( c * c - 4 * k * m ) !== 0 ) {
          // TODO::  possibly decouple any constants or terms not dependent on t, x, or v as we don't need a new object
          //         k, c, and g may change, but not with every update.

          /** Real Values **/
          // mg + kx
          var mgPluskx = m * g + k * x;

          /**  Complex values **/
          // alpha = i sqrt( 4km - c^2 )
          var alpha = Complex.real( Math.sqrt( 4 * k * m - c * c ) ).multiply( Complex.I );
          // beta = 1 + e^(alpha t / m )
          var beta = alpha.multiply( Complex.real( dt / m ) ).exponentiate().add( Complex.ONE );
          // zeta = 2e^( (c+alpha)(t/2m) )
          var eta = alpha.add( Complex.real( c ) ).multiply( dt / ( 2 * m ) )
            .exponentiate().multiply( Complex.real( 2 ) );

          //TODO:: coef does not depend on dt, x or v.  Move this to a property?
          var coef = Complex.ONE.divide( Complex.real( k * Math.sqrt( c * c - 4 * k * m ) ).multiply( eta ) );
          var term1 = beta.subtract( Complex.real( 2 ) ).multiply( Complex.real( c * mgPluskx + 2 * k * m * v ) );
          var term2 = alpha.multiply( beta.multiply( Complex.real( mgPluskx ) )
            .subtract( eta.multiply( Complex.real( m * g ) ) ) );

          this.displacement = term1.plus( term2 ).times( coef );

        }
        // Critically damped case
        else {
          //TODO::  if needed decouple these objects
          var omega = Math.sqrt( k / m );
          var phi = Math.pow( Math.E, dt * omega );

          this.displacement = ( m * g / ( phi * k ) ) * ( -phi + dt * omega + 1) + dt * ( x * ( omega + 1 ) + v );
        }

        // TODO: Update velocity
        this.mass.position.y = this.bottom;
      }
    }
  } );

} );
