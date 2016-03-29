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
  function Spring( position, naturalRestingLength, springConstantRange, defaultDampingCoefficient ) {
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
      dampingCoefficient: defaultDampingCoefficient, // {number} units N.s/m - viscous damping coefficient of the system
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
        ////console.log( 'length: ' + ( naturalRestingLength - displacement ) );
        return naturalRestingLength - displacement;
      }
    );

    // @public y position of the bottom end of the spring, units = m
    this.bottomProperty = new DerivedProperty( [ this.positionProperty, this.lengthProperty ],
      function( position, length ) {
        ////console.log( 'bottom: ' + ( position.y - length ) );
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
      //ensures displacement will change on reset, otherwise springs will be upside down.
      // TODO: find a better fix for this problem.
      this.displacement = 1;
      PropertySet.prototype.reset.call( this );
    },

    /**
     * @public
     */
    removeMass: function() {
      if ( this.mass ) {
        this.mass.detach();
      }
      this.displacement = 0;
      this.mass = null;
      this.animating = false;
    },

    /**
     * @public
     *
     * @param {Mass} mass
     */
    addMass: function( mass ) {
      if ( this.mass ) {
        this.mass.detach();
      }
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

        ////console.log( 'k,m,c,v,x,g = ' + k + ',' + m + ',' + c + ',' + v + ',' + x + ',' + g );

        // Underdamped and Overdamped case
        if ( ( c * c - 4 * k * m ) !== 0 ) {
          // TODO::  possibly decouple any constants or terms not dependent on t, x, or v as we don't need a new object
          //         k, c, and g may change, but not with every update.

          var km = k * m;
          var gm = g * m;
          var tDm = dt / m;
          var kx = k * x;
          var c2 = c * c;
          var kR = Math.sqrt( k );
          var k32 = k * kR;

          var alpha = Complex.real( 4 * km - c2 ).times( Complex.I );
          var alphaI = Complex.real( c2 - 4 * km ).sqrtOf();
          var beta = Complex.real( tDm ).times( alpha ).exponentiated();
          var eta =  Complex.real( c ).plus( alpha ).times( Complex.real( tDm / 2 ) )
            .exponentiated().times( Complex.real( 2 ) );

          var coef = Complex.ONE.dividedBy(
            Complex.real( 2 * k32 ).times( eta ).times( alphaI )
          );

          var A = ( beta.minus( Complex.ONE ) ).times( Complex.real( c * kR * ( gm + kx ) ) );
          var B = Complex.real( gm * kR ).times( alpha ).times(
            beta.minus( eta.times( Complex.real( 2 ) ) ).plus( Complex.ONE )
          );
          var C = Complex.real( 2 * k32 * m * v ).times( beta );
          var D = Complex.real( k32 * x ).times( alpha ).times( beta );
          var E = Complex.real( k32 * x ).times( alpha );
          var F = Complex.real( -2 * k32 * m * v );


          //var coef = Complex.real( 1 / k32 ).divide( eta ).divide( alphaI );
          //var term1 = Complex.real( kR ).times( beta.minus( Complex.ONE ) ).times(
          //  Complex.real( c * ( gm * kx ) + 2 * km * v )
          //);
          //var term2 = alpha.times(
          //  Complex.real( gm + kx * kR ).times( beta.plus( Complex.ONE ) ).plus( Complex.real( gm ).times( eta ) )
          //);



          this.displacement = coef.times( A.plus( B ).plus( C ).plus( D ).plus( E ).plus( F ) ).real;
          assert && assert( !isNaN( this.displacement ), 'displacement must be a number' );

          var alphaP = Complex.real( 4 * km - c2 ).sqrtOf();
          var atD2m = Complex.real( tDm / 2 ).times( alphaP );
          var k32mvT2c = Complex.real( k32 * m * v * 2 * c );

          coef = Complex.real( -Math.exp( - c * dt / ( 2 * m ) ) / ( 2 * k32 * m) ).times( Complex.I )
            .dividedBy( alphaI );
          var term1 = atD2m.sin().times(
            Complex.real( kR ).times( Complex.real( gm + kx ) ).times( alphaP.squared().plus( Complex.real( c2 ) ) )
              .plus( k32mvT2c )
          );
          var term2 = atD2m.cos().times( k32mvT2c ).times( alphaP ).times( Complex.real( -1 ) );

          this.mass.verticalVelocity = term1.plus( term2 ).times( coef ).real;
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
