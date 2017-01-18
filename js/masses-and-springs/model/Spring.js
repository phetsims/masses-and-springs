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
    var self = this;

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

    //  Restart animation if it was squelched
    this.gravityProperty.link( function() {
      if ( self.mass ) {
        self.animating = true;
      }
    } );
    this.springConstantProperty.link( function() {
      if ( self.mass ) {
        self.animating = true;
      }
    } );

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
      this.mass.springProperty.set( this );
      this.displacement = this.mass.positionProperty.get().y - ( this.position.y - this.naturalRestingLength );
      this.mass.verticalVelocityProperty.set( 0 );
      this.animating = true;
    },

    /**
     * @public
     *
     * @param {number} dt - animation time step
     */
    oscillate: function( dt ) {
      if ( this.mass && !this.mass.userControlledProperty.get() && this.animating ) {
        //TODO:: implement upper limit for dt
        var k = this.springConstant;
        var m = this.mass.mass;
        var c = this.dampingCoefficient;
        var v = this.mass.verticalVelocityProperty.get();
        var x = this.displacement;
        var g = this.gravity;

        //console.log( 'k,m,c,v,x,g,t = ' + k + ',' + m + ',' + c + ',' + v + ',' + x + ',' + g + ',' + dt );

        // Underdamped and Overdamped case
        if ( ( c * c - 4 * k * m ) !== 0 ) {
          // TODO::  possibly decouple any constants or terms not dependent on t, x, or v as we don't need a new object
          //         for example k, c, and g may change, but not with every update.
          // TODO:: improve readability of variables

          // Precompute expressions used more than twice
          var km = k * m;
          var gm = g * m;
          var tDm = dt / m;
          var kx = k * x;
          var c2 = c * c;
          var kR2 = Math.sqrt( k );
          var k3R2 = k * kR2;
          var twok3R2mv = Complex.real( 2 * k3R2 * m * v );
          var alpha = Complex.real( 4 * km - c2 ).sqrt();
          var alphaI = alpha.times( Complex.I );
          var alphaPrime = Complex.real( c2 - 4 * km ).sqrt();
          var alphatD2m = Complex.real( tDm / 2 ).multiply( alpha );
          var beta = Complex.real( tDm ).multiply( alphaI ).exponentiate();
          var eta = Complex.real( c ).add( alphaI ).multiply( Complex.real( tDm / 2 ) ).exponentiate()
            .multiply( Complex.real( 2 ) );

          // Calculate new displacement
          var coef = Complex.ONE.dividedBy( Complex.real( k3R2 ).multiply( alphaPrime ).multiply( eta ) );
          var A = beta.minus( Complex.ONE ).multiply( Complex.real( c * kR2 * ( gm + kx ) ) );
          var B = Complex.real( gm * kR2 ).multiply( alphaI ).multiply(
            beta.minus( eta ).add( Complex.ONE )
          );
          var C = twok3R2mv.times( beta );
          var D = Complex.real( k3R2 * x ).multiply( alphaI );
          var E = D.times( beta );
          var newDisplacement = coef.multiply( A.add( B ).add( C ).add( D ).add( E ).subtract( twok3R2mv ) ).real;

          // Calculate new velocity
          coef = Complex.real( -( Math.exp( ( -c * dt ) / ( 2 * m ) ) ) / ( 2 * k3R2 * m ) ).divide( alphaPrime )
            .multiply( Complex.I );
          A = alphatD2m.sinOf().multiply(
            Complex.real( kR2 * ( gm + kx ) )
              .multiply( alpha.squared().add( Complex.real( c2 ) ) )
              .add( twok3R2mv.times( Complex.real( c ) ) ) );
          B = alphatD2m.cos().multiply( twok3R2mv ).multiply( alpha ).multiply( Complex.real( -1 ) );
          var newVelocity = A.add( B ).multiply( coef ).real;

          //  Stop the alternation between +/- in overdamped displacement
          // TODO:: This is probably a bug in the model equation. Are we missing an i somewhere?
          if ( ( c * c - 4 * k * m ) > 0 ) {
            newDisplacement = ( this.displacement > 0 ) ? Math.abs( newDisplacement ) : -Math.abs( newDisplacement );
          }

          //Squelch noise after coming to rest with tolerance of 1 mm
          if ( Math.abs( this.displacement - newDisplacement ) < .0001 &&
               Math.abs( this.mass.verticalVelocityProperty.get() ) < .0001 ) {
            this.displacement = -m * g / k;  //Equilibrium length
            this.mass.verticalVelocityProperty.set( 0 );
            this.animating = false;
          }
          else {
            this.displacement = newDisplacement;
            this.mass.verticalVelocityProperty.set( newVelocity );
          }

          assert && assert( !isNaN( this.displacement ), 'displacement must be a number' );
          assert && assert( !isNaN( this.mass.verticalVelocityProperty.get() ), 'velocity must be a number' );

        }
        // Critically damped case
        else {
          //TODO::  if needed decouple these objects
          var omega = Math.sqrt( k / m );
          var phi = Math.exp( dt * omega );


          this.displacement = ( g * ( -m * phi + dt * Math.sqrt( k * m ) + m ) +
                                k * (  dt * ( x * omega + v ) + x )
                              ) / ( phi * k );
          this.mass.verticalVelocityProperty.set( ( g * m * ( Math.sqrt( k * m ) - omega * ( m + dt * Math.sqrt( k * m ) ) ) -
                                                    k * ( m * v * ( omega * dt - 1 ) + k * dt * x )
                                                  ) / ( phi * k * m) );
        }

        this.mass.positionProperty.set( new Vector2( this.position.x, this.bottomProperty.get() ) );
      }
    }
  } );

} );
