// Copyright 2016-2018, University of Colorado Boulder

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
  var Complex = require( 'DOT/Complex' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassIO = require( 'MASSES_AND_SPRINGS/common/model/MassIO' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Range = require( 'DOT/Range' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2IO = require( 'DOT/Vector2IO' );

  // phet-io modules
  var NullableIO = require( 'ifphetio!PHET_IO/types/NullableIO' );
  var NumberIO = require( 'ifphetio!PHET_IO/types/NumberIO' );

  // constants
  var DEFAULT_THICKNESS = 3; // empirically determined

  /**
   * @param {Vector2} position - coordinates of the top center of the spring
   * @param {number} initialNaturalRestingLength - initial resting length of unweighted spring in m
   * @param {number} defaultDampingCoefficient N.s/m - viscous damping coefficient of the system
   * @param {Property.<number>} gravityProperty - the gravity property from the model
   * @param {Tandem} tandem
   * @param {Object} [options]
   * REVIEW: Options are never used? (Correct me if wrong)
   *
   * @constructor
   */
  function Spring( position, initialNaturalRestingLength, defaultDampingCoefficient, gravityProperty, tandem, options ) {

    // validate and save options
    assert && assert( initialNaturalRestingLength > 0, 'naturalRestingLength must be > 0 : '
                                                       + initialNaturalRestingLength );
    var self = this;

    //REVIEW: If things initialized with options should be stored for later access, break them out into their own
    //REVIEW: properties set on the object.
    //REVIEW: Also this, would need type docs (noting what is used, etc.)
    //REVIEW: If options are never used, can this be removed, and these things can be turned into constants?
    this.options = _.extend( {
      modelViewTransform: null,
      forcesOrientation: 1  // Used to position massNode forces. Right side: 1, Left side: -1
    }, options );

    // range of natural resting length in meters (values used from design doc)
    //REVIEW: One usage, so inline? And use Range instead of RangeWithValue.
    var naturalRestingLengthRange = new RangeWithValue( 0.1, 0.5, initialNaturalRestingLength );

    // @public {Property.<number>} gravitational acceleration
    this.gravityProperty = new NumberProperty( gravityProperty.value );

    // Link to manage gravity value for the spring object.
    gravityProperty.link(function(gravity){
      self.gravityProperty.set(gravity);
    });

    //  @public {Property.<number>} distance from of the bottom of the spring from the natural resting position
    this.displacementProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'displacementProperty' ),
      units: 'meters',
      //REVIEW: Only Range needed instead of RangeWithValue for NumberProperty's range option. Just use Range.
      range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0 )
    } );

    //REVIEW: null not noted in the type docs
    // @public {Property.<number>} distance from of the bottom of the spring from the massEquilibriumYPosition
    //REVIEW: This might only depend on this.massEquilibriumYPositionProperty, massCenterOfMassProperty, I see a link
    //REVIEW: below. Can we try this as a DerivedProperty?
    //REVIEW: If not, why is it not reset directly?
    this.massEquilibriumDisplacementProperty = new Property( null );

    // @public {Property.<number>} spring constant of spring
    this.springConstantProperty = new NumberProperty( MassesAndSpringsConstants.SPRING_CONSTANT_RANGE.defaultValue, {
      tandem: tandem.createTandem( 'springConstantProperty' ),
      units: 'newtons/meters',
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    } );

    // @public {Property.<number>} spring force
    this.springForceProperty = new DerivedProperty(
      [ this.displacementProperty, this.springConstantProperty ],
      function( displacement, springConstant ) {
        return -springConstant * displacement;
      },
      {
        units: 'newtons',
        phetioType: DerivedPropertyIO( NumberIO )
      }
    );

    // @public {Property.<number>} viscous damping coefficient of the system
    this.dampingCoefficientProperty = new NumberProperty( defaultDampingCoefficient, {
      tandem: tandem.createTandem( 'dampingCoefficientProperty' ),
      units: 'newtons-second/meters',
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    } );

    // @public {Property.<Vector2>} position of the spring, originated at the top-center of the spring node
    this.positionProperty = new Property( position, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );

    // @public {Property.<number>} length of the spring without mass attached
    this.naturalRestingLengthProperty = new NumberProperty( initialNaturalRestingLength, {
      tandem: tandem.createTandem( 'naturalRestingLengthProperty' ),
      units: 'meters',
      range: naturalRestingLengthRange
    } );

    // @public {Property.<number> read-only} line width of oscillating spring node
    //REVIEW: Does this need to be reset?
    this.thicknessProperty = new NumberProperty( DEFAULT_THICKNESS, {
      tandem: tandem.createTandem( 'thicknessProperty' ),
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    } );

    // Calling this function here will set a calculated value for the thickness property.
    this.updateThickness( this.naturalRestingLengthProperty.get(), this.springConstantProperty.get() );

    // @public {Property.<boolean>} determines whether the animation for the spring is played or not
    this.animatingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'animatingProperty' )
    } );

    // @public {Property.<Mass|null> read-write} This is the Mass object that is attached to the spring
    this.massAttachedProperty = new Property( null, {
      tandem: tandem.createTandem( 'massAttachedProperty' ),
      phetioType: PropertyIO( NullableIO( MassIO ) )
    } );

    // @public {Property.<number>} Kinetic Energy of the attached Mass
    this.kineticEnergyProperty = new DynamicProperty( this.massAttachedProperty, {
      derive: 'kineticEnergyProperty',
      defaultValue: 0
    } );

    // @public {Property.<number>} Gravitational Potential Energy of the attached Mass
    this.gravitationalPotentialEnergyProperty = new DynamicProperty( this.massAttachedProperty, {
      derive: 'gravitationalPotentialEnergyProperty',
      defaultValue: 0
    } );

    // @public {Property.<number>} Elastic Potential Energy of the attached Mass
    this.elasticPotentialEnergyProperty = new DerivedProperty( [ this.springConstantProperty, this.displacementProperty ],
      function( springConstant, displacement ) {
        return 0.5 * springConstant * Math.pow( (displacement), 2 );
      } );

    // @public {Property.<number>} Thermal Energy of the attached Mass
    this.thermalEnergyProperty = new DynamicProperty( this.massAttachedProperty, {
      derive: 'thermalEnergyProperty',
      defaultValue: 0
    } );

    // @public {Property.boolean} Flag to enable the stop button for the spring.
    this.buttonEnabledProperty = new BooleanProperty( false );

    // @public {Property.<number>} (read-only) length of the spring, units = m
    this.lengthProperty = new DerivedProperty(
      [ this.naturalRestingLengthProperty, this.displacementProperty ],
      function( naturalRestingLength, displacement ) {
        return naturalRestingLength - displacement;
      },
      {
        tandem: tandem.createTandem( 'lengthProperty' ),
        units: 'meters',
        range: new Range( 0, Number.POSITIVE_INFINITY ),
        phetioType: DerivedPropertyIO( NumberIO )
      }
    );

    // @public {Property.<number} (read-only) y position of the bottom end of the spring, units = m
    this.bottomProperty = new DerivedProperty(
      [ this.positionProperty, this.lengthProperty ],
      function( position, length ) {
        return position.y - length;
      },
      {
        tandem: tandem.createTandem( 'bottomProperty' ),
        units: 'meters',
        range: new Range( 0, Number.POSITIVE_INFINITY ),
        phetioType: DerivedPropertyIO( NumberIO )
      }
    );

    //REVIEW: NumberProperty?
    //REVIEW: Specify read-write as (read-only) AFTER the type docs. Add type docs here.
    // @public {read-only} y position of the equilibrium position
    //REVIEW: Consider trying to make this a DerivedProperty. Also... why is its phetioType a DerivedPropertyIO?
    //REVIEW: Maybe it can be null when there is no mass attached?
    this.equilibriumYPositionProperty = new Property( 0,
      {
        tandem: tandem.createTandem( 'equilibriumYPositionProperty' ),
        units: 'meters',
        range: new Range( 0, Number.POSITIVE_INFINITY ),
        phetioType: DerivedPropertyIO( NumberIO )
      } );

    // Set the equilibrium position when a mass is attached to the spring. We do a similar process in Mass.js when the mass value changes.
    Property.multilink( [ this.springConstantProperty, this.gravityProperty, this.massAttachedProperty, this.naturalRestingLengthProperty ],
      function( springConstant, gravity, mass, naturalRestingLength ) {
        if ( mass ) {
          var springExtensionValue = ( mass.massProperty.value * self.gravityProperty.value) / self.springConstantProperty.value;
          self.equilibriumYPositionProperty.set( self.positionProperty.get().y - naturalRestingLength - springExtensionValue );
        }
      } );

    // @public {Property.<boolean>} Responsible for the visibility of the period trace.
    //REVIEW: BooleanProperty?
    //REVIEW: Why is this not reset?
    //REVIEW: Wait, is this property never set a value?
    this.periodTraceVisibilityProperty = new Property( false );

    //REVIEW: NumberProperty?
    // @public {Property.<number>} y position of the equilibrium position centered on mass's center of mass
    //REVIEW: Can we try to turn this into a derived property, with a 0 or null if there is no mass attached?
    this.massEquilibriumYPositionProperty = new Property( 0,
      {
        tandem: tandem.createTandem( 'equilibriumYPositionProperty' ),
        units: 'meters',
        range: new Range( 0, Number.POSITIVE_INFINITY ),
        phetioType: DerivedPropertyIO( NumberIO )
      } );

    var massCenterOfMassProperty = new DynamicProperty( this.massAttachedProperty, {
      derive: 'centerOfMassPositionProperty',
      defaultValue: null
    } );

    Property.multilink( [ this.massEquilibriumYPositionProperty, massCenterOfMassProperty ], function( massEquilibriumYPosition, massCenterOfMass ) {
      if ( massCenterOfMass !== null ) {
        self.massEquilibriumDisplacementProperty.set( massCenterOfMass.y - massEquilibriumYPosition );
      }
    } );

    // Set the equilibrium position when a mass is attached to the spring. We do a similar process in Mass.js when the mass value changes.
    Property.multilink( [ this.springConstantProperty, this.gravityProperty, this.massAttachedProperty, this.naturalRestingLengthProperty ],
      function( springConstant, gravity, mass, naturalRestingLength ) {
        if ( mass ) {
          var springExtensionValue = ( mass.massProperty.value * self.gravityProperty.value) / self.springConstantProperty.value;
          self.massEquilibriumYPositionProperty.set( self.positionProperty.get().y - naturalRestingLength - springExtensionValue - mass.heightProperty.value / 2 );
        }
      } );

    this.springConstantProperty.link( function( springConstant ) {
      self.updateThickness( self.naturalRestingLengthProperty.get(), springConstant );
    } );

    // When the length of the spring is adjusted we need to adjust the position of the attached mass.
    this.naturalRestingLengthProperty.link( function() {
      if ( self.massAttachedProperty.value ) {
        self.setMass( self.massAttachedProperty.get() );
      }
    } );

    //REVIEW: Type doc
    // @public used to determine when the period tracer should alternate directions
    //REVIEW: Since the emit() takes 1 argument, that should be documented (type, value/purpose)
    this.peakEmitter = new Emitter();

    //REVIEW: Type doc
    // @public used to determine when the mass has crossed over its equilibrium position while oscillating
    this.crossEmitter = new Emitter();

    //REVIEW: Type doc
    // @public used to determine when the mass is dropped
    this.droppedEmitter = new Emitter();

    this.massEquilibriumDisplacementProperty.link( function( newValue, oldValue ) {
      if ( ( oldValue >= 0 ) !== ( newValue >= 0 ) && oldValue !== null && newValue !== null ) {
        self.crossEmitter.emit();
      }
    } );
  }

  massesAndSprings.register( 'Spring', Spring );

  return inherit( Object, Spring, {
    /**
     * @public
     */
    reset: function() {
      this.buttonEnabledProperty.reset();
      this.gravityProperty.reset();
      this.displacementProperty.reset();
      this.dampingCoefficientProperty.reset();
      this.positionProperty.reset();
      this.naturalRestingLengthProperty.reset();
      this.massAttachedProperty.reset();
      this.springConstantProperty.reset();
      this.animatingProperty.reset();
      this.thicknessProperty.reset();
    },

    /**
     * Retains the properties of the spring in an object that can publicly accessed.
     * @public
     *
     * REVIEW: Fully document the return value. Maybe it should have its own type for this (SpringState.js). Did we
     * REVIEW: discuss that?
     */
    getSpringState: function() {
      return {
        displacement: this.displacementProperty.get(),
        gravity: this.gravityProperty.get(),
        dampingCoefficient: this.dampingCoefficientProperty.get(),
        position: this.positionProperty.get(),
        naturalRestingLength: this.naturalRestingLengthProperty.get(),
        mass: this.massAttachedProperty.get(),
        springConstant: this.springConstantProperty.get(),
        thickness: this.thicknessProperty.get()
      };
    },

    /**
     * Sets the properties of the spring with previously stored properties.
     * @param {Object} springState - Sets the properties of the spring with previously stored properties.
     * REVIEW: At least reference getSpringState for the param documentation (so things don't have to be repeated).
     *
     * @public
     */
    setSpringState: function( springState ) {
      this.displacementProperty.set( springState.displacement );
      this.gravityProperty.set( springState.gravity );
      this.dampingCoefficientProperty.set( springState.dampingCoefficient );
      this.positionProperty.set( springState.position );
      this.naturalRestingLengthProperty.set( springState.naturalRestingLength );
      this.massAttachedProperty.set( springState.mass );
      this.springConstantProperty.set( springState.springConstant );
      this.thicknessProperty.set( springState.thickness );
    },

    /**
     * Updates thickness of spring and sets its thickness property to calculated value. This is not handled internally
     * by the spring because the intro model determines the conditions for updating thickness.
     * @public
     *
     * REVIEW: Type comes before the name in the type docs
     * @param length {number} current natural resting length of spring
     * @param springConstant {number} current spring constant of spring
     */
    updateThickness: function( length, springConstant ) {

      // We are increasing the significance of the spring constant term by adding an exponent, which is empirically determined.
      var thickness = this.thicknessProperty.initialValue
                      * springConstant / this.springConstantProperty.initialValue
                      * length / this.naturalRestingLengthProperty.initialValue;
      this.thicknessProperty.set( thickness );
    },

    /**
     * Updates springConstant of spring and sets its spring constant property to calculated value. This is not handled
     * internally by the spring because the intro model determines the conditions for updating spring constant.
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
      this.buttonEnabledProperty.set( false );
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
      //REVIEW: I saw very similar code in Mass that included setting the displacementProperty. This should all be
      //REVIEW: factored out into one place, so that the computation is not duplicated.
      this.displacementProperty.set( this.massAttachedProperty.get().positionProperty.get().y -
                                     ( this.positionProperty.get().y - this.naturalRestingLengthProperty.get() ) - mass.hookHeight / 2 );
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
        var springExtensionValue = ( mass.massProperty.value * this.gravityProperty.value) / this.springConstantProperty.value;
        this.displacementProperty.set( -springExtensionValue );

        // place that mass at the correct location as well
        //REVIEW: Some place should have the factored-out usage of determing things, as I've seen tons of expressions
        //REVIEW: that have to add/subtract mass.hookHeight / 2.
        mass.positionProperty.set( new Vector2( this.positionProperty.get().x, this.equilibriumYPositionProperty.get() + mass.hookHeight / 2 ) );
        mass.verticalVelocityProperty.set( 0 );
        mass.accelerationProperty.set( 0 ); //REVIEW: How is its acceleration 0. Do we handle acceleration due to gravity?
        this.buttonEnabledProperty.set( false );
      }
    },

    /**
     * Responsible for oscillatory motion of spring system.
     * @param {number} dt - animation time step
     *
     * @public
     */
    step: function( dt ) {
      if ( this.massAttachedProperty.get() && !this.massAttachedProperty.get().userControlledProperty.get() ) {
        this.massAttachedProperty.get().preserveThermalEnergy = false;

        // REVIEW: This is a pretty complex algorithm and would be difficult to dig into on its own.  Is there some
        // references that could be provided that describe where this came from?
        //REVIEW: JO will do this.

        var k = this.springConstantProperty.get();
        var m = this.massAttachedProperty.get().massProperty.get();
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

          // In this case ( c * c - 4 * k m < 0 ) and we are underdamped.
          // Squelch noise after coming to rest with tolerance of 1 micron
          if ( Math.abs( this.displacementProperty.get() - newDisplacement ) < 1e-6 &&
               Math.abs( this.massAttachedProperty.get().verticalVelocityProperty.get() ) < 1e-6 ) {
            this.displacementProperty.set( -m * g / k );  // Equilibrium length
            this.massAttachedProperty.get().verticalVelocityProperty.set( 0 );
          }
          else {
            this.displacementProperty.set( newDisplacement );
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

        this.massAttachedProperty.get().positionProperty.set(
          new Vector2( this.positionProperty.get().x, this.bottomProperty.get() + this.massAttachedProperty.get().hookHeight / 2 )
        );

        this.buttonEnabledProperty.set( this.massAttachedProperty.get().verticalVelocityProperty.get() !== 0 );
        this.massAttachedProperty.get().preserveThermalEnergy = true;
      }
    }
  } );
} )
;