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

    // validate and save options
    assert && assert( naturalRestingLength > 0, 'naturalRestingLength must be > 0 : ' + naturalRestingLength );
    this.naturalRestingLength = naturalRestingLength; // @public read-only

    assert && assert( springConstantRange.min > 0, 'minimum spring constant must be positive : '
                                                   + springConstantRange.min );
    this.springConstantRange = springConstantRange; // @public read-only

    //------------------------------------------------
    // Properties
    PropertySet.call( this, {
      gravity: 9.8, // {number} units m/s^2  //TODO:: initialize with gravity of default body from Model
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

        //console.log( 'k,m,c,v,x,g,t = ' + k + ',' + m + ',' + c + ',' + v + ',' + x + ',' + g + ',' + dt );

        // Underdamped and Overdamped case
        if ( ( c * c - 4 * k * m ) !== 0 ) {
          // TODO::  possibly decouple any constants or terms not dependent on t, x, or v as we don't need a new object
          //         for example k, c, and g may change, but not with every update.
          // TODO:: substitute mutability where appropriate
          // TODO:: improve readability of variables

          var km = k * m;
          var gm = g * m;
          var tDm = dt / m;
          var kx = k * x;
          var c2 = c * c;
          var kR2 = Math.sqrt( k );
          var k3R2 = k * kR2;

          var alpha = Complex.real( 4 * km - c2 ).sqrtOf().times( Complex.I );
          var alphaInv = Complex.real( c2 - 4 * km ).sqrtOf();
          var beta = Complex.real( tDm ).times( alpha ).exponentiated();
          var eta = Complex.real( c ).plus( alpha ).times( Complex.real( tDm / 2 ) ).exponentiated()
            .times( Complex.real( 2 ) );

          var coef = Complex.ONE.dividedBy( Complex.real( k3R2 ).times( alphaInv ).times( eta ) );

          var A = ( beta.minus( Complex.ONE ) ).times( Complex.real( c * kR2 * ( gm + kx ) ) );
          var B = Complex.real( gm * kR2 ).times( alpha ).times(
            beta.minus( eta ).plus( Complex.ONE )
          );
          var C = Complex.real( 2 * k3R2 * m * v ).times( beta );
          var D = Complex.real( k3R2 * x ).times( alpha ).times( beta );
          var E = Complex.real( k3R2 * x ).times( alpha );
          var F = Complex.real( -2 * k3R2 * m * v );

          var newDisplacement = coef.times( A.plus( B ).plus( C ).plus( D ).plus( E ).plus( F ) ).real;

          // Update overdamped displacement
          // TODO:: this is probably a bug in the model equation.
          if ( ( c * c - 4 * k * m ) > 0 ) {
            //  Stop the alternation between +/-.
            if ( this.displacement > 0 ) {
              this.displacement = Math.abs( newDisplacement );
            }
            else {
              this.displacement = -Math.abs( newDisplacement );
            }

            //  Squelch the random perturbations after coming to rest with tolerance of 1 mm.
            if ( Math.abs( this.displacement ) < .001 ) {
              this.displacement = 0;
            }
          }
          // Update underdamped displacement
          else {
            this.displacement = newDisplacement;
          }
          //console.log( 'displacement = ' + this.displacement );

          assert && assert( !isNaN( this.displacement ), 'displacement must be a number' );

          var alphaPrime = Complex.real( 4 * km - c2 ).sqrtOf();
          var alphaPrimetD2m = Complex.real( tDm / 2 ).times( alphaPrime );
          var twok3R2mv = 2 * k3R2 * m * v;

          coef = Complex.real( -( Math.exp( ( -c * dt ) / ( 2 * m ) ) ) / ( 2 * k3R2 * m ) ).dividedBy( alphaInv )
            .times( Complex.I );
          A = alphaPrimetD2m.sinOf().times(
            Complex.real( kR2 ).times( Complex.real( gm + kx ) )
              .times( alphaPrime.squared().plus( Complex.real( c2 ) ) )
              .plus( Complex.real( twok3R2mv * c ) ) );
          B = alphaPrimetD2m.cosOf().times( Complex.real( -twok3R2mv ) ).times( alphaPrime );

          this.mass.verticalVelocity = A.plus( B ).times( coef ).real;
          assert && assert( !isNaN( this.mass.verticalVelocity ), 'velocity must be a number' );

        }
        // Critically damped case
        else {
          //TODO::  if needed decouple these objects
          var omega = Math.sqrt( k / m );
          var phi = Math.exp( dt * omega );


          this.displacement = ( g * ( -m * phi + dt * Math.sqrt( k * m ) + m ) +
                                k * (  dt * ( x * omega + v ) + x )
                              ) / ( phi * k );
          this.mass.verticalVelocity = ( g * m * ( Math.sqrt( k * m ) - omega * ( m + dt * Math.sqrt( k * m ) ) ) -
                                         k * ( m * v * ( omega * dt - 1 ) + k * dt * x )
                                       ) / ( phi * k * m);
        }

        this.mass.position = new Vector2( this.position.x, this.bottomProperty.get() );
      }
    }
  } );

} );
