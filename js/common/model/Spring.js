// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each spring.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Range = require( 'DOT/Range' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Property = require( 'AXON/Property' );
  var Complex = require( 'DOT/Complex' );
  var Vector2 = require( 'DOT/Vector2' );
  var TVector2 = require( 'DOT/TVector2' );
  var TMass = require( 'MASSES_AND_SPRINGS/common/model/TMass' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  // constants
  var DEFAULT_THICKNESS = 3; // view-coordinates, empirically determined

  /**
   * @param {Vector2} position - coordinates of the top center of the spring
   * @param {number} initialNaturalRestingLength - initial resting length of unweighted spring in m
   * @param {RangeWithValue} springConstantRange - k in N/m
   * @param {number} defaultDampingCoefficient N.s/m - viscous damping coefficient of the system
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function Spring( position, initialNaturalRestingLength, springConstantRange, defaultDampingCoefficient, tandem, options ) {
    var self = this;

    this.options = _.extend( {
      modelViewTransform: null
    }, options );

    // range of natural resting length in meters (values used from design doc)
    // REVIEW: This is pretty minor, but we should be consisten about using .1 versus 0.1.  I think we generally use 0.1, since Java has issues with the other format.
    // Do this for every instance of .1
    var naturalRestingLengthRange = new RangeWithValue( 0.1, 0.5, initialNaturalRestingLength );

    // derived empirically from updateSpringThickness()
    // REVIEW: What are the units?
    var thicknessRange = new RangeWithValue( 0.6, 3, DEFAULT_THICKNESS );

    // @public {Property.<number>} gravitational acceleration
    this.gravityProperty = new Property( massesAndSprings.Body.EARTH.gravity, {
      tandem: tandem.createTandem( 'gravityProperty' ),
      phetioValueType: TNumber( {
        units: 'meters/second/second',
        range: new RangeWithValue( 0, 30, massesAndSprings.Body.EARTH.gravity )
      } )
    } );

    //  @public {Property.<number>} distance from of the bottom of the spring from the natural resting position
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
        range: springConstantRange
      } )
    } );

    // @public {Property.<number>} spring force
    this.springForceProperty = new DerivedProperty(
      [ this.displacementProperty, this.springConstantProperty ],
      function( displacement, springConstant ) {
        return -1 * springConstant * displacement;
      },
      {
        phetioValueType: TNumber( {
          units: 'newtons'
        } )
      }
    );

    // @public {Property.<number>} viscous damping coefficient of the system
    this.dampingCoefficientProperty = new Property( defaultDampingCoefficient, {
      tandem: tandem.createTandem( 'dampingCoefficientProperty' ),
      phetioValueType: TNumber( {
        units: 'newtons-second/meters',
        range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, defaultDampingCoefficient )
      } )
    } );

    // @public {Property.<Vector2>} position of the spring, originated at the top-center of the spring node
    this.positionProperty = new Property( position, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioValueType: TVector2
    } );

    // @public {Property.<number>} length of the spring without mass attached
    this.naturalRestingLengthProperty = new Property( initialNaturalRestingLength, {
      tandem: tandem.createTandem( 'naturalRestingLengthProperty' ),
      phetioValueType: TNumber( {
        units: 'meters',
        range: naturalRestingLengthRange
      } )
    } );

    // @public {Property.<number> read-only} line width of oscillating spring node
    // REVIEW: this should probably be in some units other than screen coords, e.g. meters, for consistency with rest of sim
    this.thicknessProperty = new Property( DEFAULT_THICKNESS, {
      tandem: tandem.createTandem( 'thicknessProperty' ),
      phetioValueType: TNumber( {
        //units: screenViewCoordinates
        range: thicknessRange
      } )
    } );

    // Calling this function here will set a calculated value for the thickness property.
    this.updateThickness( this.naturalRestingLengthProperty.get(), this.springConstantProperty.get() );

    // @public {Property.<boolean>} determines whether the animation for the spring is played or not
    this.animatingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'animatingProperty' )
    } );

    // @public {Property.<Mass>}
    this.massAttachedProperty = new Property( null, {
      tandem: tandem.createTandem( 'massAttachedProperty' ),
      phetioValueType: TMass
    } );

    // @public (read-only) - distance from natural resting position to equilibrium position (units: m)
    this.springExtension = 0;

    // validate and save options
    // REVIEW: Since these are validation of the values provided to the constructor, they should be at the beginning of the constructor.
    assert && assert( initialNaturalRestingLength > 0, 'naturalRestingLength must be > 0 : ' + initialNaturalRestingLength );
    assert && assert( springConstantRange.min > 0, 'minimum spring constant must be positive : '
                                                   + springConstantRange.min );
    this.springConstantRange = springConstantRange; // @public read-only

    //------------------------------------------------
    // Derived properties

    // @public {read-only} length of the spring, units = m
    this.lengthProperty = new DerivedProperty(
      [ this.naturalRestingLengthProperty, this.displacementProperty ],
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

    // @public {read-only} y position of the bottom end of the spring, units = m
    this.bottomProperty = new DerivedProperty(
      [ this.positionProperty, this.lengthProperty ],
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
    this.equilibriumYPositionProperty = new DerivedProperty(
      [ this.springConstantProperty, this.gravityProperty, this.massAttachedProperty, this.naturalRestingLengthProperty ],
      function( springConstant, gravity, mass, naturalRestingLength ) {
        // springExtension = mg/k
        self.springExtension = mass ? ( mass.mass * gravity ) / springConstant : 0;
        return self.positionProperty.get().y - naturalRestingLength - self.springExtension;
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
    Property.multilink( [ this.massAttachedProperty, this.gravityProperty, this.springConstantProperty ], function( mass ) {
      if ( mass ) {
        self.animatingProperty.set( true );
      }
    } );

    this.springConstantProperty.link( function( springConstant ) {
      self.updateThickness( self.naturalRestingLengthProperty.get(), springConstant );
    } );
  }

  massesAndSprings.register( 'Spring', Spring );

  return inherit( Object, Spring, {

    /**
     * @override
     *
     * @public
     */
    reset: function() {
      this.gravityProperty.reset();
      this.displacementProperty.reset();
      this.dampingCoefficientProperty.reset();
      this.positionProperty.reset();
      this.naturalRestingLengthProperty.reset();
      this.animatingProperty.reset();
      this.massAttachedProperty.reset();
      this.springConstantProperty.reset();
    },
    /**
     * Retains the properties of the spring in an object that can publicly accessed.
     *
     * @public
     */
    getSpringState: function() {
      var springState = {
        displacement: this.displacementProperty.get(),
        gravity: this.gravityProperty.get(),
        dampingCoefficient: this.dampingCoefficientProperty.get(),
        position: this.positionProperty.get(),
        naturalRestingLength: this.naturalRestingLengthProperty.get(),
        animating: this.animatingProperty.get(),
        mass: this.massAttachedProperty.get(),
        springConstant: this.springConstantProperty.get(),
        thickness: this.thicknessProperty.get()
      };
      return springState;
    },

    /**
     * Sets the properties of the spring with previously stored properties.
     * @param {Object} springState - Sets the properties of the spring with previously stored properties.
     *
     * @public
     */
    setSpringState: function( springState ) {
      this.displacementProperty.set( springState.displacement );
      this.gravityProperty.set( springState.gravity );
      this.dampingCoefficientProperty.set( springState.dampingCoefficient );
      this.positionProperty.set( springState.position );
      this.naturalRestingLengthProperty.set( springState.naturalRestingLength );
      this.animatingProperty.set( springState.animating );
      this.massAttachedProperty.set( springState.mass );
      this.springConstantProperty.set( springState.springConstant );
      this.thicknessProperty.set( springState.thickness );
    },

    // REVIEW: There should be some documentation on the next two methods that describe why they are called by
    // external entities instead of handled internally.

    /**
     * Updates thickness of spring and sets its thickness property to calculated value.
     * @public
     *
     * @param length {number} current natural resting length of spring
     * @param springConstant {number} current spring constant of spring
     */
    updateThickness: function( length, springConstant ) {
      var thickness = this.thicknessProperty.initialValue
                      * springConstant / this.springConstantProperty.initialValue
                      * length / this.naturalRestingLengthProperty.initialValue;
      this.thicknessProperty.set( thickness );
    },

    /**
     * Updates springConstant of spring and sets its spring constant property to calculated value.
     * @public
     *
     * @param length {number} current natural resting length of spring
     * @param thickness number {number} current thickness of spring
     */
    updateSpringConstant: function( length, thickness ) {
      var springConstant = this.naturalRestingLengthProperty.initialValue / length
                           * thickness / this.thicknessProperty.initialValue
                           * this.springConstantProperty.initialValue;
      this.springConstantProperty.set( springConstant );
    },

    /**
     * Removes mass from spring.
     *
     * @public
     */
    removeMass: function() {
      if ( this.massAttachedProperty.get() ) {
        this.massAttachedProperty.get().detach();
      }
      this.displacementProperty.set( 0 );
      this.massAttachedProperty.set( null );
      this.animatingProperty.set( false );
    },

    /**
     * Sets mass on spring
     * @param {Mass} mass
     *
     * @public
     */
    setMass: function( mass ) {
      if ( this.massAttachedProperty.get() ) {
        this.massAttachedProperty.get().detach();
      }
      this.massAttachedProperty.set( mass );
      this.massAttachedProperty.get().springProperty.set( this );
      this.displacementProperty.set( this.massAttachedProperty.get().positionProperty.get().y -
                                     ( this.positionProperty.get().y - this.naturalRestingLengthProperty.get() ) );
      this.massAttachedProperty.get().verticalVelocityProperty.set( 0 );
    },

    /**
     * Stop spring motion by setting the displacement to the spring's extension, which is the length from the natural
     * resting position. This will also stop the spring from further oscillation.
     *
     * @public
     */
    stopSpring: function() {

      // check if mass attached on spring
      if ( this.massAttachedProperty.get() ) {
        var mass = this.massAttachedProperty.get();

        // set displacement and stop further animation
        this.displacementProperty.set( -this.springExtension );
        this.animatingProperty.reset();

        // place that mass at the correct location as well
        mass.positionProperty.set( new Vector2( this.positionProperty.get().x, this.bottomProperty.get() ) );
        mass.verticalVelocityProperty.set( 0 );
        mass.accelerationProperty.set( 0 );
      }
    },

    // REVIEW: Calling this method simply 'step' would be more consistent within this sim and with other PhET sims.
    /**
     * Responsible for oscillatory motion of spring system.
     * @param {number} dt - animation time step
     *
     * @public
     */
    stepOscillate: function( dt ) {
      if ( this.massAttachedProperty.get() && !this.massAttachedProperty.get().userControlledProperty.get() &&
           this.animatingProperty.get() ) {

        // REVIEW: This is a pretty complex algorithm and would be difficult to dig into on its own.  Is there some
        // references that could be provided that describe where this came from?

        //TODO:: implement upper limit for dt
        var k = this.springConstantProperty.get();
        var m = this.massAttachedProperty.get().mass;
        var c = this.dampingCoefficientProperty.get();
        var v = this.massAttachedProperty.get().verticalVelocityProperty.get();
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
               Math.abs( this.massAttachedProperty.get().verticalVelocityProperty.get() ) < 1e-6 ) {
            this.displacementProperty.set( -m * g / k );  // Equilibrium length
            this.massAttachedProperty.get().verticalVelocityProperty.set( 0 );
            this.animatingProperty.set( false );
          }
          else {
            this.displacementProperty.set( newDisplacement );
            //TODO: add in the kinematic equation for acceleration here. Store old velocity and use new velocity in equ.
            this.massAttachedProperty.get().verticalVelocityProperty.set( newVelocity );
          }

          assert && assert( !isNaN( this.displacementProperty.get() ), 'displacement must be a number' );
          assert && assert( !isNaN( this.massAttachedProperty.get().verticalVelocityProperty.get() ), 'velocity must be a number' );

        }
        // Critically damped case
        else {
          //TODO::  if needed decouple these objects
          var omega = Math.sqrt( k / m );
          var phi = Math.exp( dt * omega );


          this.displacementProperty.set( ( g * ( -m * phi + dt * Math.sqrt( k * m ) + m ) +
                                           k * (  dt * ( x * omega + v ) + x )
                                         ) / ( phi * k ) );
          this.massAttachedProperty.get().verticalVelocityProperty.set( ( g * m * ( Math.sqrt( k * m ) - omega * ( m + dt * Math.sqrt( k * m ) ) ) -
                                                                          k * ( m * v * ( omega * dt - 1 ) + k * dt * x )
                                                                        ) / ( phi * k * m) );
        }

        this.massAttachedProperty.get().positionProperty.set( new Vector2( this.positionProperty.get().x, this.bottomProperty.get() ) );
      }
    }
  } );
} )
;
