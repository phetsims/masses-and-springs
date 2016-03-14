// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Complex = require( 'DOT/Complex' );
  var Vector2 = require( 'DOT/Vector2' );

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
        console.log( "length: " + ( naturalRestingLength - displacement ) );
        return naturalRestingLength - displacement;
      }
    );

    // @public y position of the bottom end of the spring, units = m
    this.bottomProperty = new DerivedProperty( [ this.positionProperty, this.lengthProperty ],
      function( position, length ) {
        console.log( "bottom: " + ( position.y - length ) );
        return position.y - length;
      }
    );

    //------------------------------------------------
    // Property observers

    // k: When spring constant changes, adjust either displacement or applied force
    // TODO:: This may not be neccessary because k is handled in the oscillate function
    //this.springConstantProperty.link( function( springConstant ) {
    //  assert && assert( self.springConstantRange.contains( springConstant ), 'springConstant is out of range: ' +
    // springConstant ); // TODO: calculate displacement and/or period based on attached mass and new spring constant
    // // self.displacement = self.appliedForce / springConstant; // x = F/k } );
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
          // 2kmv
          var twokmv = 2 * k * m * v;

          /**  Complex values for displacement **/
          // alpha = i sqrt( 4km - c^2 )
          var xAlpha = Complex.real( Math.sqrt( 4 * k * m - c * c ) ).multiply( Complex.imaginary( 1 ) );
          // beta = 1 + e^(alpha t / m )
          var xBeta = xAlpha.times( Complex.real( dt / m ) ).exponentiate().add( Complex.real( 1 ) );
          // zeta = 2e^( (c+alpha)(t/2m) )
          var xEta = xAlpha.plus( Complex.real( c ) ).multiply( Complex.real( dt / ( 2 * m ) ) )
            .exponentiate().multiply( Complex.real( 2 ) );

          //TODO:: coef does not depend on dt, x or v.  Move this to a property?
          var xCoef = Complex.real( 1 ).divide(
            Complex.real( c * c - 4 * k * m ).sqrt().multiply( Complex.real( k ) ).multiply( xEta )
          );
          var xTerm1 = xBeta.minus( Complex.real( 2 ) ).multiply( Complex.real( c * mgPluskx + twokmv ) );
          var xTerm2 = xAlpha.times( xBeta.times( Complex.real( mgPluskx ) )
            .subtract( xEta.times( Complex.real( m * g ) ) ) );

          this.displacement = xTerm1.plus( xTerm2 ).multiply( xCoef ).real;
          assert && assert( !isNaN( this.displacement ), 'displacement must be a number' );

          /**  Complex values for velocity **/
          // sqrt( 4km - c^2 )
          var vAlpha = Complex.real( 4 * k * m - c * c ).sqrt();
          // alpha t/2m
          var vBeta = vAlpha.times( Complex.real( dt / ( 2 * m ) ) );

          var vCoef = Complex.imaginary( 1 ).multiply(
            Complex.real( -Math.exp( -c * dt / (2 * m ) ) / ( 2 * k * m ) ).multiply(
              Complex.real( 1 / ( c * c - 4 * k * m ) ).sqrt()
            )
          );
          var vTerm1 = Complex.real( -2 * k * m * v ).multiply( vBeta.cos() ).multiply( vAlpha );
          var vTerm2 = Complex.real( 2 * c * k * m * v ).add(
            Complex.real( mgPluskx ).multiply( Complex.real( c * c ).add( vAlpha.squared() ) )
          ).multiply( vBeta.sin() );

          this.mass.verticalVelocity = vTerm1.plus( vTerm2 ).multiply( vCoef ).real;
          assert && assert( !isNaN( this.mass.verticalVelocity ), 'velocity must be a number' );

        }
        // Critically damped case
        else {
          //TODO::  if needed decouple these objects
          var omega = Math.sqrt( k / m );
          var phi = Math.pow( Math.E, dt * omega );

          this.displacement = ( m * g / ( phi * k ) ) * ( -phi + dt * omega + 1) + dt * ( x * ( omega + 1 ) + v );

          //TODO::  find velocity
        }

        this.mass.position = new Vector2( this.position.x, this.bottomProperty.get() );
      }
    }
  } );

} );
