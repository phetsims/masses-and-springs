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
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsQueryParameters = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsQueryParameters' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var BodyIO = require( 'MASSES_AND_SPRINGS/common/model/BodyIO' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

  // constants
  var GRABBING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be connected
  var RELEASE_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be released

  /**
   * @constructor
   *
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  function MassesAndSpringsModel( tandem, options ) {

    var self = this;

    // @public {Property.<boolean>} determines whether the sim is in a play/pause state
    this.playingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'playingProperty' )
    } );

    //@public {Property.<boolean>} determines whether the sim is playing sound
    this.isSoundEnabledProperty = new Property( true, {
      tandem: tandem.createTandem( 'isSoundEnabledProperty' )
    } );

    // @public {Property.<number>} coefficient of damping applied to the system
    this.dampingProperty = new Property( 0, {
      units: 'newtons',
      tandem: tandem.createTandem( 'dampingProperty' )
    } );

    // @public {Property.<number>} gravitational acceleration associated with each planet
    this.gravityProperty = new NumberProperty( Body.EARTH.gravity, {
      tandem: tandem.createTandem( 'gravityProperty' ),
      units: 'meters/second/second',
      range: new RangeWithValue( 0, 30, Body.EARTH.gravity )
    } );

    // @public {Property.<string>} determines the speed at which the sim plays.
    this.simSpeedProperty = new Property( 'normal', {
      tandem: tandem.createTandem( 'simSpeedProperty' ),
      phetioType: PropertyIO( StringIO ),
      validValues: [ 'slow', 'normal' ]
    } );

    // @public {Property.<boolean>} determines visibility of ruler node
    this.rulerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'rulerVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of timer node
    this.timerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerVisibleProperty' )
    } );

    // @public {Property.<number>} elapsed time shown in the timer (rounded off to the nearest second)
    this.timerSecondsProperty = new NumberProperty( 0, {
      range: new RangeWithValue( 0, Number.POSITIVE_INFINITY, 0 ),
      tandem: tandem.createTandem( 'timerSecondsProperty' ),
      units: 'seconds'
    } );

    // @public {Property.<boolean>} determines whether timer is active or not
    this.timerRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerRunningPropertyProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of movable line node
    this.movableLineVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'movableLineVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of equilibrium line node
    this.equilibriumPositionVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'equilibriumPositionVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of natural length line node
    this.naturalLengthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'naturalLengthVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of displacement arrow node
    this.displacementVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'displacementVisibleProperty' )
    } );

    // @public {Property.<string>} name of planet selected
    this.bodyProperty = new Property( Body.EARTH, {
      tandem: tandem.createTandem( 'bodyProperty' ),
      phetioType: PropertyIO( BodyIO )
    } );

    // Visibility properties of vectors associated with each mass
    // @public {Property.<boolean>} determines the visibility of the velocity vector
    this.velocityVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'velocityVectorVisibilityProperty' )
    } );

    // @public {Property.<boolean>} determines the visibility of the acceleration vector
    this.accelerationVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'accelerationVectorVisibilityProperty' )
    } );

    // @public {Property.<boolean>} determines the visibility of the gravitational force vector
    this.gravityVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'gravityVectorVisibilityProperty' )
    } );

    // @public {Property.<boolean>} determines the visibility of the spring force vector
    this.springVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'springVectorVisibilityProperty' )
    } );

    // @public {Property.<string>} determines mode of the vectors to be viewed
    this.forcesModeProperty = new Property( MassesAndSpringsConstants.FORCES_STRING, {
      tandem: tandem.createTandem( 'forcesModeProperty' ),
      phetioType: PropertyIO( StringIO ),
      validValues: [ MassesAndSpringsConstants.FORCES_STRING, MassesAndSpringsConstants.NET_FORCE_STRING ]
    } );

    // @public {Spring[]} Array that will contain all of the springs.
    this.springs = [];

    // @public {Mass[]} Array that will contain all of the masses.
    this.masses = [];

    // Used for testing purposes
    if ( MassesAndSpringsQueryParameters.printSpringProperties ) {
      Property.multilink( [ self.springs[ 0 ].springConstantProperty, self.springs[ 0 ].thicknessProperty ], function( springConstant, springThickness ) {

        console.log( 'springConstant = ' + Util.toFixed( springConstant, 3 ) + '\t\t' + 'thickness = ' + Util.toFixed( springThickness, 3 ) );
      } );
    }
  }

  massesAndSprings.register( 'MassesAndSpringsModel', MassesAndSpringsModel );

  return inherit( Object, MassesAndSpringsModel, {

    /**
     * Creates new mass object and pushes it into the model's mass array.
     * @public
     *
     * @param {number} mass - mass in kg
     * @param {number} xPosition - starting x-coordinate of the mass object, offset from the first spring position
     * @param {boolean} labelVisible - should a label be shown on the MassNode
     * @param {string} color - color of the MassNode
     * @param {string} specifiedLabel - customized label for the MassNode
     * @param {Tandem} tandem
     */
    createMass: function( mass, xPosition, labelVisible, color, specifiedLabel, tandem ) {
      this.masses.push( new Mass( mass, new Vector2( xPosition, 0.5 ), labelVisible, color, this.gravityProperty, tandem ) );
    },

    /**
     * Creates a new spring and adds it to the model.
     * @public
     *
     * @param {number} x - The x coordinate of the spring, in model coordinates.
     * @param {Tandem} tandem
     */
    createSpring: function( x, tandem ) {
      var spring = new Spring(
        new Vector2( x, MassesAndSpringsConstants.CEILING_Y ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        this.dampingProperty.get(),
        tandem
      );
      this.springs.push( spring );

      // Links are used to set gravity property of each spring to the gravity property of the system
      this.gravityProperty.link( function( newGravity ) {
        spring.gravityProperty.set( newGravity );
      } );

      // Links are used to set damping property of each spring to the damping property of the system
      this.dampingProperty.link( function( newDamping ) {
        assert && assert( newDamping >= 0, 'damping must be greater than or equal to 0: ' + newDamping );
        spring.dampingCoefficientProperty.set( newDamping );
      } );
    },

    /**
     * Spring set that contains two springs. Used on the Intro and Vector screens.
     * @protected
     *
     * @param {Tandem} tandem
     */
    addDefaultSprings: function( tandem ) {
      this.createSpring( MassesAndSpringsConstants.RIGHT_SPRING_X - 0.25, tandem.createTandem( 'leftSpring' ) );
      this.createSpring( MassesAndSpringsConstants.RIGHT_SPRING_X, tandem.createTandem( 'rightSpring' ) );
    },

    /**
     * Mass set that contains seven standard masses. Used on the Intro and Vector screens.
     * @protected
     *
     * @param {Tandem} tandem
     */
    addDefaultMasses: function( tandem ) {
      this.createMass( 0.250, 0.12, true, 'grey', null, tandem.createTandem( 'largeLabeledMass' ) );
      this.createMass( 0.100, 0.20, true, 'grey', null, tandem.createTandem( 'mediumLabeledMass1' ) );
      this.createMass( 0.100, 0.28, true, 'grey', null, tandem.createTandem( 'mediumLabeledMass2' ) );
      this.createMass( 0.050, 0.33, true, 'grey', null, tandem.createTandem( 'smallLabeledMass' ) );
      this.createMass( 0.200, 0.63, false, 'blue', null, tandem.createTandem( 'largeUnlabeledMass' ) );
      this.createMass( 0.150, 0.56, false, 'green', null, tandem.createTandem( 'mediumUnlabeledMass' ) );
      this.createMass( 0.075, 0.49, false, 'red', null, tandem.createTandem( 'smallUnlabeledMass' ) );
    },

    /**
     * @public
     */
    reset: function() {
      this.dampingProperty.reset();
      this.gravityProperty.reset();
      this.bodyProperty.reset();
      this.playingProperty.reset();
      this.simSpeedProperty.reset();
      this.rulerVisibleProperty.reset();
      this.timerVisibleProperty.reset();
      this.timerSecondsProperty.reset();
      this.timerRunningProperty.reset();
      this.movableLineVisibleProperty.reset();
      this.naturalLengthVisibleProperty.reset();
      this.equilibriumPositionVisibleProperty.reset();
      this.velocityVectorVisibilityProperty.reset();
      this.accelerationVectorVisibilityProperty.reset();
      this.gravityVectorVisibilityProperty.reset();
      this.springVectorVisibilityProperty.reset();
      this.displacementVisibleProperty.reset();
      this.forcesModeProperty.reset();
      this.masses.forEach( function( mass ) { mass.reset(); } );
      this.springs.forEach( function( spring ) { spring.reset(); } );
    },

    /**
     * Based on new dragged position of mass, try to attach or detach mass if eligible and then update position.
     *
     * @param {Mass} mass
     * @param {Bounds2} visibleBounds - visible bounds of the sim screen
     * @public
     */
    adjustDraggedMassPosition: function( mass, visibleBounds ) {
      var massPosition = mass.positionProperty.get();

      // Attempt to detach
      if ( mass.springProperty.get()
           && Math.abs( mass.springProperty.get().positionProperty.get().x - massPosition.x ) > RELEASE_DISTANCE ) {
        mass.springProperty.get().removeMass();
        mass.detach();
      }

      // Update mass position and spring length if attached
      if ( mass.springProperty.get() ) {

        // Update the position of the mass
        if ( mass.positionProperty.value.x !== mass.springProperty.get().positionProperty.get().x ) {
          mass.positionProperty.set( mass.positionProperty.get().copy().setX( mass.springProperty.get().positionProperty.get().x ) );
        }

        // Update spring length
        mass.springProperty.get().displacementProperty.set(
          -( mass.springProperty.get().positionProperty.get().y -
             mass.springProperty.get().naturalRestingLengthProperty.get() ) +
          massPosition.y );

        // Maximum y value the spring should be able to contract based on the thickness and amount of spring coils.
        var maxY = mass.springProperty.get().thicknessProperty.get() *
                   OscillatingSpringNode.MAP_NUMBER_OF_LOOPS( mass.springProperty.get().naturalRestingLengthProperty.get() );

        // Constraints used to limit how much we can prime the spring's oscillation.
        var upperConstraint = new LinearFunction( 20, 60, 1.112, 1.006 );

        // Max Y value in model coordinates
        var modelMaxY = upperConstraint( maxY );

        // Update only the spring's length if we are lower than the max Y
        if ( mass.positionProperty.get().y > modelMaxY ) {

          // set mass position to maximum y position based on spring coils
          mass.positionProperty.set( mass.positionProperty.get().copy().setY( modelMaxY ) );

          // Limit the length of the spring to based on the spring coils.
          mass.springProperty.get().displacementProperty.set(
            -( mass.springProperty.get().positionProperty.get().y -
               mass.springProperty.get().naturalRestingLengthProperty.get() ) +
            modelMaxY );
        }
      }

      // Update mass position if unattached
      else {

        //Attempt to attach
        this.springs.forEach( function( spring ) {
          if ( Math.abs( massPosition.x - spring.positionProperty.get().x ) < GRABBING_DISTANCE &&
               Math.abs( massPosition.y - spring.bottomProperty.get() ) < GRABBING_DISTANCE &&
               spring.massAttachedProperty.get() === null ) {
            spring.setMass( mass );
          }
        } );
      }
    },

    /**
     * Responsible for stepping through the model at a specified dt
     *
     * @public
     */
    stepForward: function( dt ) {
      this.modelStep( dt );// steps the nominal amount used by step forward button listener
    },

    /**
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      // If simulationTimeStep > 0.3, ignore it - it probably means the user returned to the tab after
      // the tab or the browser was hidden for a while.
      dt = Math.min( dt, 0.3 );

      if ( this.playingProperty.get() ) {
        this.modelStep( dt );
      }
    },
    /**
     * Steps in model time.
     *
     * @param {number} dt
     * @private
     */
    modelStep: function( dt ) {
      var self = this;
      var animationDt = dt;

      // Change the dt value if we are playing in slow motion.
      if ( this.simSpeedProperty.get() === 'slow' && this.playingProperty.get() ) {
        dt = dt / MassesAndSpringsConstants.SIM_DT_RATIO;
      }
      _.values( this.masses ).forEach( function( mass ) {

        // Fall if not hung or grabbed
        mass.step( self.gravityProperty.get(), MassesAndSpringsConstants.FLOOR_Y + .02, dt, animationDt );
      } );
      if ( this.timerRunningProperty.get() ) {
        this.timerSecondsProperty.set( this.timerSecondsProperty.get() + dt );
      }

      // Oscillate springs
      this.springs.forEach( function( spring ) {
        spring.step( dt );
      } );
    }
  }, {
    // Array of bodies that are referenced throughout the model.
    BODIES: [ Body.MOON, Body.EARTH, Body.JUPITER, Body.PLANET_X, Body.CUSTOM ]
  } );
} );
