// Copyright 2016-2022, University of Colorado Boulder

/**
 * Common model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';
import MassesAndSpringsColors from '../view/MassesAndSpringsColors.js';
import OscillatingSpringNode from '../view/OscillatingSpringNode.js';
import Body from './Body.js';
import ForcesMode from './ForcesMode.js';
import Mass from './Mass.js';
import Spring from './Spring.js';

// constants
const GRABBING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be connected
const RELEASE_DISTANCE = 0.12; // {number} horizontal distance in meters from a mass where a spring will be released
const UPPER_CONSTRAINT = new LinearFunction( 20, 60, 1.353, 1.265 ); // Limits how much we can prime the spring.

class MassesAndSpringsModel {
  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {
    options = merge( {
      damping: 0
    }, options );

    // Flag used to differentiate basics and non-basics version
    this.basicsVersion = true;

    // @public {Property.<boolean>} determines whether the sim is in a play/pause state
    this.playingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'playingProperty' )
    } );

    // @public {Property.<number>} coefficient of damping applied to the system
    this.dampingProperty = new NumberProperty( options.damping, {
      units: 'N',
      tandem: tandem.createTandem( 'dampingProperty' )
    } );

    // @public {Property.<number|null>} gravitational acceleration association with the spring system
    this.gravityProperty = new Property( MassesAndSpringsConstants.EARTH_GRAVITY, {
      reentrant: true, // used due to extremely small rounding
      tandem: tandem.createTandem( 'gravityProperty' ),
      units: 'm/s/s'
    } );

    // @private Controls play speed of the simulation
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: tandem.createTandem( 'timeSpeedProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of ruler node
    this.rulerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'rulerVisibleProperty' )
    } );

    // @public
    this.stopwatch = new Stopwatch( {
      timePropertyOptions: {
        range: Stopwatch.ZERO_TO_ALMOST_SIXTY
      },
      tandem: tandem.createTandem( 'stopwatch' )
    } );

    // @public {Property.<boolean>} determines whether timer is active or not
    this.timerRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerRunningProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of movable line node
    this.movableLineVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'movableLineVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of equilibrium line node
    this.equilibriumPositionVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'equilibriumPositionVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of natural length line node. Note this is also used for the
    // displacementArrowNode's visibility because they should both be visible at the same time.
    this.naturalLengthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'naturalLengthVisibleProperty' )
    } );

    // @public {Property.<string>} body of planet selected
    this.bodyProperty = new Property( Body.EARTH, {
      tandem: tandem.createTandem( 'bodyProperty' ),
      phetioValueType: Body.BodyIO
    } );

    // Visibility Properties of vectors associated with each mass
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
    this.forcesModeProperty = new EnumerationDeprecatedProperty(
      ForcesMode,
      ForcesMode.FORCES, {
        tandem: tandem.createTandem( 'forcesModeProperty' )
      } );

    // @public {Spring[]} Array that will contain all of the springs.
    this.springs = [];

    // @public {Mass[]} Array that will contain all of the masses. Order of masses depends on order in array.
    this.masses = [];
  }


  /**
   * Creates new mass object and pushes it into the model's mass array.
   * @public
   *
   * @param {number} mass - mass in kg
   * @param {number} xPosition - starting x-coordinate of the mass object, offset from the first spring position
   * @param {Color} color - color of the MassNode
   * @param {string} specifiedLabel - customized label for the MassNode
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  createMass( mass, xPosition, color, specifiedLabel, tandem, options ) {
    this.masses.push( new Mass( mass, xPosition, color, this.gravityProperty, tandem, options ) );
  }

  /**
   * Creates a new spring and adds it to the model.
   * @public
   *
   * @param {number} x - The x coordinate of the spring, in model coordinates.
   * @param {Tandem} tandem
   */
  createSpring( x, tandem ) {
    const spring = new Spring(
      new Vector2( x, MassesAndSpringsConstants.CEILING_Y ),
      MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
      this.dampingProperty,
      this.gravityProperty,
      tandem
    );
    this.springs.push( spring );
  }

  /**
   * Spring set that contains two springs. Used on the Intro and Vector screens.
   * @protected
   *
   * @param {Tandem} tandem
   */
  addDefaultSprings( tandem ) {
    this.createSpring( MassesAndSpringsConstants.LEFT_SPRING_X, tandem.createTandem( 'leftSpring' ) );
    this.createSpring( MassesAndSpringsConstants.RIGHT_SPRING_X, tandem.createTandem( 'rightSpring' ) );
    this.firstSpring = this.springs[ 0 ];
    this.firstSpring.forcesOrientationProperty.set( -1 );
    this.secondSpring = this.springs[ 1 ];
    this.secondSpring.forcesOrientationProperty.set( 1 );
  }

  /**
   * Mass set that contains a set of standard masses. Used for several screens in basics and non-basics version.
   * @protected
   *
   * @param {Tandem} tandem
   */
  addDefaultMasses( tandem ) {
    if ( this.basicsVersion ) {
      this.createMass( 0.250, 0.12, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'largeMass1' ) );
      this.createMass( 0.250, 0.16, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'largeMass2' ) );
      this.createMass( 0.100, 0.30, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'mediumMass1' ) );
      this.createMass( 0.100, 0.33, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'mediumMass2' ) );
      this.createMass( 0.050, 0.425, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'smallMass1' ) );
      this.createMass( 0.050, 0.445, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'smallMass2' ) );


      // Mystery masses
      this.createMass( 0.200, 0.76, MassesAndSpringsColors.largeMysteryMassProperty, null, tandem.createTandem( 'largeMysteryMass' ), {
        mysteryLabel: true
      } );
      this.createMass( 0.100, 0.69, MassesAndSpringsColors.mediumMysteryMassProperty, null, tandem.createTandem( 'mediumMysteryMass' ), {
        mysteryLabel: true
      } );
      this.createMass( 0.075, 0.62, MassesAndSpringsColors.smallMysteryMassProperty, null, tandem.createTandem( 'smallMysteryMass' ), {
        mysteryLabel: true
      } );
    }
    else {
      this.createMass( 0.250, 0.12, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'largeMass' ) );
      this.createMass( 0.100, 0.20, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'mediumMass1' ) );
      this.createMass( 0.100, 0.28, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'mediumMass2' ) );
      this.createMass( 0.050, 0.33, MassesAndSpringsColors.labeledMassProperty, null, tandem.createTandem( 'smallMass' ) );


      // Mystery masses
      this.createMass( 0.200, 0.63, MassesAndSpringsColors.largeMysteryMassProperty, null, tandem.createTandem( 'largeMysteryMass' ), {
        mysteryLabel: true
      } );
      this.createMass( 0.150, 0.56, MassesAndSpringsColors.mediumMysteryMassProperty, null, tandem.createTandem( 'mediumMysteryMass' ), {
        mysteryLabel: true
      } );
      this.createMass( 0.075, 0.49, MassesAndSpringsColors.smallMysteryMassProperty, null, tandem.createTandem( 'smallMysteryMass' ), {
        mysteryLabel: true
      } );
    }
  }

  /**
   * @public
   */
  reset() {
    this.dampingProperty.reset();
    this.gravityProperty.reset();
    this.bodyProperty.reset();
    this.playingProperty.reset();
    this.timeSpeedProperty.reset();
    this.rulerVisibleProperty.reset();
    this.stopwatch.reset();
    this.timerRunningProperty.reset();
    this.movableLineVisibleProperty.reset();
    this.naturalLengthVisibleProperty.reset();
    this.equilibriumPositionVisibleProperty.reset();
    this.velocityVectorVisibilityProperty.reset();
    this.accelerationVectorVisibilityProperty.reset();
    this.gravityVectorVisibilityProperty.reset();
    this.springVectorVisibilityProperty.reset();
    this.forcesModeProperty.reset();
    this.masses.forEach( mass => { mass.reset(); } );
    this.springs.forEach( spring => { spring.reset(); } );
  }

  /**
   * Based on new dragged position of mass, try to attach or detach mass if eligible and then update position.
   *
   * @param {Mass} mass
   * @public
   */
  adjustDraggedMassPosition( mass ) {
    const massPosition = mass.positionProperty.get();

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
        mass.positionProperty.set( mass.positionProperty.get().copy().setX(
          mass.springProperty.get().positionProperty.get().x ) );
      }

      // Update spring displacementProperty so correct spring length is used.
      mass.springProperty.value.updateDisplacement( massPosition.y, false );

      // Maximum y value the spring should be able to contract based on the thickness and amount of spring coils.
      const maxY = mass.springProperty.get().thicknessProperty.get() *
                   OscillatingSpringNode.MAP_NUMBER_OF_LOOPS(
                     mass.springProperty.get().naturalRestingLengthProperty.get() );

      // Max Y value in model coordinates
      const modelMaxY = UPPER_CONSTRAINT.evaluate( maxY );

      // Update only the spring's length if we are lower than the max Y
      if ( mass.positionProperty.get().y > modelMaxY ) {

        // set mass position to maximum y position based on spring coils
        mass.positionProperty.set( mass.positionProperty.get().copy().setY( modelMaxY ) );

        // Limit the length of the spring based on the spring coils.
        mass.springProperty.value.updateDisplacement( modelMaxY, false );
      }
    }

    // Update mass position if unattached
    else {

      // Attempt to attach. Assumes springs are far enough apart where one mass can't attach to multiple springs.
      this.springs.forEach( spring => {
        if ( Math.abs( massPosition.x - spring.positionProperty.get().x ) < GRABBING_DISTANCE &&
             Math.abs( massPosition.y - spring.bottomProperty.get() ) < GRABBING_DISTANCE &&
             spring.massAttachedProperty.get() === null ) {
          spring.setMass( mass );
        }
      } );
    }
  }

  /**
   * Responsible for stepping through the model at a specified dt
   * @param {number} dt
   *
   * @public
   */
  stepForward( dt ) {

    // steps the nominal amount used by step forward button listener
    this.modelStep( dt );

    // Reset the period trace for each spring.
    // See https://github.com/phetsims/masses-and-springs-basics/issues/58#issuecomment-462860440
    this.springs.forEach( spring => {
      if ( spring.periodTrace && spring.periodTrace.stateProperty.value === 4 ) {
        spring.periodTraceResetEmitter.emit();
      }
    } );
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {
    // If simulationTimeStep > 0.3, ignore it - it probably means the user returned to the tab after
    // the tab or the browser was hidden for a while.
    dt = Math.min( dt, 0.3 );

    if ( this.playingProperty.get() ) {
      this.modelStep( dt );
    }
  }

  /**
   * Steps in model time.
   *
   * @param {number} dt
   * @private
   */
  modelStep( dt ) {
    const animationDt = dt;

    // Change the dt value if we are playing in slow motion.
    if ( this.timeSpeedProperty.get() === TimeSpeed.SLOW && this.playingProperty.get() ) {
      dt = dt / MassesAndSpringsConstants.SLOW_SIM_DT_RATIO;
    }
    for ( let i = 0; i < this.masses.length; i++ ) {

      // Fall if not hung or grabbed
      this.masses[ i ].step(
        this.gravityProperty.value,
        MassesAndSpringsConstants.FLOOR_Y + MassesAndSpringsConstants.SHELF_HEIGHT,
        dt,
        animationDt
      );
    }
    this.stopwatch.step( dt );

    // Oscillate springs
    this.springs.forEach( spring => {
      spring.step( dt );
    } );
  }
}

massesAndSprings.register( 'MassesAndSpringsModel', MassesAndSpringsModel );

export default MassesAndSpringsModel;