// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each spring node.
 * 
 * @author Matt Pennington
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Range = require( 'DOT/Range' );

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Property = require( 'AXON/Property' );
  var Complex = require( 'DOT/Complex' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TVector2 = require( 'ifphetio!PHET_IO/types/dot/TVector2' );
  var TMass = require( 'ifphetio!PHET_IO/simulations/masses-and-springs/TMass' );

  /**
   * @param {Vector2} position - coordinates of the top center of the spring
   * @param {number} naturalRestingLength - resting length of unweighted spring in m
   * @param {Range} springConstantRange - k in N/m
   * @param {number} defaultDampingCoefficient N.s/m - viscous damping coefficient of the system
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function Spring( position, naturalRestingLength, springConstantRange, defaultDampingCoefficient, tandem ) {
    var self = this;

    // @public {Property.<number>} gravitational acceleration
    this.gravityProperty = new Property( massesAndSprings.Body.EARTH.gravity, {
      tandem: tandem.createTandem( 'gravityProperty' ),
      phetioValueType: TNumber( {
        units: 'meters/second/second',
        range: new RangeWithValue( 0, 30, massesAndSprings.Body.EARTH.gravity )
      } )
    } );

    //  @public {Property.<number>} displacement of the bottom of the spring from the natural resting position
    this.displacementProperty = new Property( 0, {
      tandem: tandem.createTandem( 'displacementProperty' ),
      phetioValueType: TNumber( {
        units: 'meters',
        range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0 )
      } )
    } );

    // @public {Property.<number>} spring constant of spring
    this.springConstantProperty = new Property( springConstantRange.defaultValue, {
      tandem: tandem.createTandem( 'springConstantProperty' ),
      phetioValueType: TNumber( {
        units: 'newtons/meters',
        range: new RangeWithValue( 5, 15, 9 )
      } )
    } );

    // this.thicknessProperty= new Property(3.5);

    // @public {Property.<number>} viscous damping coefficient of the system
    this.dampingCoefficientProperty = new Property( defaultDampingCoefficient, {
      tandem: tandem.createTandem( 'dampingCoefficientProperty' ),
      phetioValueType: TNumber( {
        units: 'newtons-second/meters',
        range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, defaultDampingCoefficient )
      } )
    } );

    // @public {Property.<Vector2>} position of the spring
    this.positionProperty = new Property( position, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioValueType: TVector2
    } );

    // @public {Proeprty.<number>} length of the spring without mass attached
    this.naturalRestingLengthProperty = new Property( naturalRestingLength, {
      tandem: tandem.createTandem( 'naturalRestingLengthProperty' ),
      phetioValueType: TNumber( {
        units: 'meters',
        range: new RangeWithValue( .1, .5, naturalRestingLength )
      } )
    } );

    // @public {Property.<boolean>} determines whether the animation for the spring is played or not
    this.animatingProperty = new Property( false, {
      tandem: tandem.createTandem( 'animatingProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Property.<Mass>}
    this.massProperty = new Property( null, {
      tandem: tandem.createTandem( 'massProperty' ),
      phetioValueType: TMass
    } );

    // @public (read-only) - distance from natural resting position to equilibrium position (units: m)
    this.springExtension = 0;

    // validate and save options
    assert && assert( naturalRestingLength > 0, 'naturalRestingLength must be > 0 : ' + naturalRestingLength );
    this.naturalRestingLengthProperty.set( naturalRestingLength ); // @public read-only

    assert && assert( springConstantRange.min > 0, 'minimum spring constant must be positive : '
                                                   + springConstantRange.min );
    this.springConstantRange = springConstantRange; // @public read-only

    //------------------------------------------------
    // Derived properties
    // @public {read-only} length of the spring, units = m
    this.lengthProperty = new DerivedProperty( [ this.naturalRestingLengthProperty, this.displacementProperty ],
      function( naturalRestingLength, displacement ) {
        return naturalRestingLength - displacement;
      },
      {
        tandem: tandem.createTandem( 'lengthProperty' ),
        phetioValueType: TNumber( {
          units: 'meters',
          range: new Range( 0, Number.POSITIVE_INFINITY )
        } )
      }
    );
    // @public {read-only} length of the spring, units = null
    this.thicknessProperty = new DerivedProperty( [ this.springConstantProperty ],
      function( springConstant ) {
        var mapThickness = new LinearFunction( 5, 15, 2.5, 5.5 );
        return mapThickness( springConstant );
      },
      {
        tandem: tandem.createTandem( 'thicknessProperty' ),
        phetioValueType: TNumber( {
          range: new Range( 2.5, 5.5 )
        } )
      }
    );

    // @public {read-only} y position of the bottom end of the spring, units = m
    this.bottomProperty = new DerivedProperty( [ this.positionProperty, this.lengthProperty ],
      function( position, length ) {
        return position.y - length;
      },
      {
        tandem: tandem.createTandem( 'bottomProperty' ),
        phetioValueType: TNumber( {
          units: 'meters',
          range: new Range( 0, Number.POSITIVE_INFINITY )
        } )
      }
    );

    // @public {read-only} y position of the equilibrium position
    this.equilibriumYPositionProperty = new DerivedProperty( [ this.springConstantProperty, this.gravityProperty, this.massProperty ],
      function( springConstant, gravity, mass ) {
        // springExtension = mg/k
        self.springExtension = mass ? (mass.mass * gravity) / springConstant : 0;
        return self.positionProperty.get().y - self.naturalRestingLengthProperty.get() - self.springExtension;
      },
      {
        tandem: tandem.createTandem( 'equilibriumYPositionProperty' ),
        phetioValueType: TNumber( {
          units: 'meters',
          range: new Range( 0, Number.POSITIVE_INFINITY )
        } )
      }
    );

    //  Restart animation if it was squelched
    this.gravityProperty.link( function() {
      if ( self.massProperty.get() ) {
        self.animatingProperty.set( true );
      }
    } );
    this.springConstantProperty.link( function() {
      if ( self.massProperty.get ) {
        self.animatingProperty.set( true );
      }
    } );
  }

  massesAndSprings.register( 'Spring', Spring );

  return inherit( Object, Spring, {

    /**
     * @public
     * @override
     *
     * @param {boolean} resetAllProperty used for stop buttons to ignore resetting every property
     */
    reset: function( resetAllProperty ) {
      //ensures displacement will change on reset, otherwise springs will be upside down.
      // TODO: find a better fix for this problem.
      this.displacementProperty.set( 1 );
      this.gravityProperty.reset();
      this.displacementProperty.reset();
      this.dampingCoefficientProperty.reset();
      this.positionProperty.reset();
      this.naturalRestingLengthProperty.reset();
      this.animatingProperty.reset();
      this.massProperty.reset();
      if ( !resetAllProperty ) {
        this.springConstantProperty.reset();
      }
    },

    updateThicknessFromLength: function() {
      this.naturalRestingLengthProperty.set( .111 * this.springConstantProperty.get() - .1377 * this.thicknessProperty.get() );
    },

    updateThicknessFromSpringConstant: function() {
      this.thicknessProperty.set( .806 * this.springConstantProperty.get() - 7.2581 * this.naturalRestingLengthProperty.get() );
    },

    updateSpringConstantFromLength: function() {
      var self = this;
      this.naturalRestingLengthProperty.link( function( length ) {
        self.springConstantProperty.set( length * 9 + 1.24 * self.thicknessProperty.get() );

        console.log( 'this.thicknessProperty.get() = ' + self.thicknessProperty.get() );
      } );
    },

    /**
     * @public
     */
    removeMass: function() {
      if ( this.massProperty.get() ) {
        this.massProperty.get().detach();
      }
      this.displacementProperty.set( 0 );
      this.massProperty.set( null );
      this.animatingProperty.set( false );
    },

    /**
     * @public
     *
     * @param {Mass} mass
     */
    addMass: function( mass ) {
      if ( this.massProperty.get() ) {
        this.massProperty.get().detach();
      }
      this.massProperty.set( mass );
      this.massProperty.get().springProperty.set( this );
      this.displacementProperty.set( this.massProperty.get().positionProperty.get().y -
                                     ( this.positionProperty.get().y - this.naturalRestingLengthProperty.get() ) );
      this.massProperty.get().verticalVelocityProperty.set( 0 );
    },

    /**
     * @public
     *
     * @param {number} dt - animation time step
     */
    oscillate: function( dt ) {
      if ( this.massProperty.get() && !this.massProperty.get().userControlledProperty.get() &&
           this.animatingProperty.get() ) {
        //TODO:: implement upper limit for dt
        var k = this.springConstantProperty.get();
        var m = this.massProperty.get().mass;
        var c = this.dampingCoefficientProperty.get();
        var v = this.massProperty.get().verticalVelocityProperty.get();
        var x = this.displacementProperty.get();
        var g = this.gravityProperty.get();

        // Underdamped and Overdamped case
        if ( ( c * c - 4 * k * m ) !== 0 ) {
          // TODO::  possibly decouple any constants or terms not dependent on t, x, or v as we don't need a new object
          //         for example k, c, and g may change, but not with every update.
          // TODO:: improve readability of variables

          // Precompute expressions used more than twice
          // TODO:: document what algorithm is being used here
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
            newDisplacement = ( this.displacementProperty.get() > 0 ) ? Math.abs( newDisplacement ) : -Math.abs( newDisplacement );
          }

          // Squelch noise after coming to rest with tolerance of 1 micron
          if ( Math.abs( this.displacementProperty.get() - newDisplacement ) < 1e-6 &&
               Math.abs( this.massProperty.get().verticalVelocityProperty.get() ) < 1e-6 ) {
            this.displacementProperty.set( -m * g / k );  // Equilibrium length
            this.massProperty.get().verticalVelocityProperty.set( 0 );
            this.animatingProperty.set( false );
          }
          else {
            this.displacementProperty.set( newDisplacement );
            this.massProperty.get().verticalVelocityProperty.set( newVelocity );
          }

          assert && assert( !isNaN( this.displacementProperty.get() ), 'displacement must be a number' );
          assert && assert( !isNaN( this.massProperty.get().verticalVelocityProperty.get() ), 'velocity must be a number' );

        }
        // Critically damped case
        else {
          //TODO::  if needed decouple these objects
          var omega = Math.sqrt( k / m );
          var phi = Math.exp( dt * omega );


          this.displacementProperty.set( ( g * ( -m * phi + dt * Math.sqrt( k * m ) + m ) +
                                           k * (  dt * ( x * omega + v ) + x )
                                         ) / ( phi * k ) );
          this.massProperty.get().verticalVelocityProperty.set( ( g * m * ( Math.sqrt( k * m ) - omega * ( m + dt * Math.sqrt( k * m ) ) ) -
                                                                  k * ( m * v * ( omega * dt - 1 ) + k * dt * x )
                                                                ) / ( phi * k * m) );
        }

        this.massProperty.get().positionProperty.set( new Vector2( this.positionProperty.get().x, this.bottomProperty.get() ) );
      }
    }
  } );

} );
