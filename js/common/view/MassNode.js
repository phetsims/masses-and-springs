// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node responsible for representing the mass object.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const ForceVectorArrow = require( 'MASSES_AND_SPRINGS/common/view/ForceVectorArrow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );
  const VectorArrow = require( 'MASSES_AND_SPRINGS/common/view/VectorArrow' );

  // strings
  const massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );
  const questionMarkString = require( 'string!MASSES_AND_SPRINGS/questionMark' );

  // constants
  const ARROW_SIZE_DEFAULT = 25;

  /**
   * @param {Mass} mass - model object
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MassNode( mass, modelViewTransform2, dragBoundsProperty, model, tandem ) {
    Node.call( this, { cursor: 'pointer' } );
    const self = this;

    // @public {Mass} (read-only)
    this.mass = mass;

    // @public (read-write) determines if the mass's velocity is below a specific value, so the period trace is hidden.
    this.thresholdReached = false;

    let hookHeight = modelViewTransform2.modelToViewDeltaY( -MassesAndSpringsConstants.HOOK_HEIGHT );
    if ( mass.icon ) {
      hookHeight = modelViewTransform2.modelToViewDeltaY( -MassesAndSpringsConstants.HOOK_HEIGHT * 0.34 );
    }

    // @public {Rectangle}
    this.rect = new Rectangle( {
      stroke: 'black',
      boundsMethod: 'unstroked',
      lineWidth: 0.5
    } );
    this.addChild( this.rect );

    // Bounds that limit where we can drag our mass should be dependent on how large our mass is
    const modelBoundsProperty = new DerivedProperty( [ dragBoundsProperty, mass.heightProperty ],
      function( dragBounds, massHeight ) {
        const modelBounds = modelViewTransform2.viewToModelBounds( dragBounds );
        modelBounds.minY += massHeight;
        return modelBounds;
      } );

    // Update the size of the massNode. Link exists for sim duration. No need to unlink.
    mass.radiusProperty.link( function( radiusValue ) {

      self.rect.rectBounds = new Bounds2(
        modelViewTransform2.modelToViewDeltaX( -radiusValue ),
        hookHeight,
        modelViewTransform2.modelToViewDeltaX( radiusValue ),
        modelViewTransform2.modelToViewDeltaY( -mass.cylinderHeightProperty.get() ) + hookHeight );

      self.rect.fill = new LinearGradient( -self.rect.width / 2, 0, self.rect.width / 2, 0 )
        .addColorStop( 0, Color.toColor( mass.color ).colorUtilsBrighter( 0.3 ) )
        .addColorStop( 0.2, Color.toColor( mass.color ).colorUtilsBrighter( 0.8 ) )
        .addColorStop( 0.7, mass.color );

      // We are constraining the draggable bounds on our massNodes except when the mass is attached to a spring.
      const minY = mass.userControlledProperty.value ?
                 modelBoundsProperty.value.minY :
                 MassesAndSpringsConstants.FLOOR_Y + MassesAndSpringsConstants.SHELF_HEIGHT + mass.heightProperty.value;

      if ( mass.positionProperty.value.y < minY && !mass.springProperty.value ) {
        mass.positionProperty.set( new Vector2( mass.positionProperty.value.x, minY ) );
      }
    } );

    // Sets the gradient on the massNode.
    this.rect.fill = new LinearGradient( -this.rect.width / 2, 0, this.rect.width / 2, 0 )
      .addColorStop( 0, Color.toColor( mass.color ).colorUtilsBrighter( 0.1 ) )
      .addColorStop( 0.2, Color.toColor( mass.color ).colorUtilsBrighter( 0.6 ) )
      .addColorStop( 0.7, mass.color );

    const hookShape = new Shape();
    const radius = hookHeight / 4;
    hookShape.arc( 0, 0, radius, Math.PI, ( 0.5 * Math.PI ) );
    hookShape.lineTo( 0, hookHeight / 2 );

    // @public {Path} Used for hook on massNode.
    this.hookNode = new Path( hookShape, {
      stroke: 'black',
      lineWidth: 1.5,
      lineCap: 'round',
      centerX: this.rect.centerX,
      boundsMethod: 'unstroked',
      bottom: this.rect.top
    } );
    this.addChild( this.hookNode );

    // Background added so all of svg elements are painted.
    // See https://github.com/phetsims/masses-and-springs/issues/278
    this.background = new Rectangle( this.bounds.dilated( 1.25 ), { pickable: false, fill: 'transparent' } );
    this.addChild( this.background );

    if ( !mass.icon ) {
      const labelString = mass.mysteryLabel ?
                        questionMarkString : StringUtils.fillIn( massValueString, { mass: mass.mass * 1000 } );
      const label = new Text( labelString, {
        font: new PhetFont( { size: 12, weight: 'bold' } ),
        centerY: this.rect.centerY,
        centerX: 0,
        pickable: false,
        maxWidth: !mass.adjustable ? this.rect.width : 30, // Adjustable masses require smaller label maxWidth.
        tandem: tandem.createTandem( 'label' )
      } );
      this.addChild( label );

      mass.massProperty.link( function() {
        label.center = self.rect.center;
      } );

      // Adjust the mass label for adjustable masses.
      if ( this.mass.adjustable ) {
        this.mass.massProperty.link( function( massValue ) {
          label.setText( StringUtils.fillIn( massValueString, { mass: Utils.roundSymmetric( massValue * 1000 ) } ) );
          label.center = self.rect.center;
        } );
      }
    }

    // @public {MovableDragHandler} (read-write)
    this.movableDragHandler = new MovableDragHandler( this.mass.positionProperty, {

      // Allow moving a finger (touch) across a node to pick it up.
      dragBounds: modelBoundsProperty.value,
      allowTouchSnag: true,
      modelViewTransform: modelViewTransform2,
      tandem: tandem.createTandem( 'dragHandler' ),

      // Handler that moves the particle in model space.
      onDrag: function() {

        if ( self.mass.springProperty.value ) {
          self.mass.springProperty.value.buttonEnabledProperty.set( false );
        }

        // Checks if mass should be attached/detached to spring and adjusts its position if so.
        model.adjustDraggedMassPosition( self.mass, dragBoundsProperty.value );
      },
      startDrag: function() {
        mass.userControlledProperty.set( true );

        if ( self.mass.springProperty.value ) {
          self.mass.springProperty.value.buttonEnabledProperty.set( false );
        }
        self.moveToFront();
      },
      endDrag: function() {
        mass.userControlledProperty.set( false );
        if ( mass.springProperty.value ) {
          mass.springProperty.value.periodTraceResetEmitter.emit();
        }
      }
    } );

    this.mass.positionProperty.link( function( position ) {
      self.translation = modelViewTransform2.modelToViewPosition( position );
    } );

    Property.multilink( [ mass.userControlledProperty, modelBoundsProperty ], ( function( userControlled, modelDragBounds ) {

      // Masses won't jump back into the model bounds attached to spring.
      // See https://github.com/phetsims/masses-and-springs/issues/291
      if ( mass.springProperty.value && !userControlled ) {
        self.movableDragHandler.setDragBounds( Bounds2.EVERYTHING );
      }
      else {
        self.movableDragHandler.setDragBounds( modelDragBounds );
      }
    } ) );

    this.addInputListener( this.movableDragHandler );

    const forceNullLine = new Line( {
      stroke: 'black',
      cursor: 'pointer'
    } );

    // Arrows created for vectors associated with mass nodes
    const velocityArrow = new VectorArrow( MassesAndSpringsConstants.VELOCITY_ARROW_COLOR );
    const accelerationArrow = new VectorArrow( MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR );
    const gravityForceArrow = new ForceVectorArrow( MassesAndSpringsConstants.GRAVITY_ARROW_COLOR );
    const springForceArrow = new ForceVectorArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR );
    const netForceArrow = new ForceVectorArrow( 'black' );

    if ( !mass.icon ) {
      this.addChild( velocityArrow );
      this.addChild( accelerationArrow );
      this.addChild( gravityForceArrow );
      this.addChild( springForceArrow );
      this.addChild( netForceArrow );
      this.addChild( forceNullLine );
    }

    // Used to position the vectors on the left of right side of the massNode depending on the attached spring.
    let forcesOrientation = 1;
    this.mass.springProperty.link( function( spring ) {
      if ( spring ) {
        forcesOrientation = spring.forcesOrientationProperty.value;
      }
    } );

    /**
     * Show/hide the velocity and acceleration arrows when appropriate
     * @param {Property.<boolean>} arrowVisibilityProperty
     * @param {Node} arrowNode
     *
     */
    const updateArrowVisibility = function( arrowVisibilityProperty, arrowNode ) {
      Property.multilink( [ mass.springProperty, arrowVisibilityProperty, mass.userControlledProperty ],
        function( spring, vectorVisibility, userControlled ) {
          arrowNode.visible = !!spring && vectorVisibility && !userControlled;
        } );
    };

    /**
     * Show/hide the spring and gravity force vectors when appropriate
     * @param {Property.<boolean>} arrowVisibilityProperty
     * @param {Node} arrowNode
     *
     */
    const updateForceVisibility = function( arrowVisibilityProperty, arrowNode ) {
      Property.multilink( [ mass.springProperty, arrowVisibilityProperty, model.forcesModeProperty ],
        function( spring, springVectorVisibility, forcesMode ) {
          arrowNode.visible = !!spring && springVectorVisibility && forcesMode === MassesAndSpringsConstants.FORCES_MODE_CHOICE.FORCES;
        } );
    };

    // Show/hide the velocity arrow
    updateArrowVisibility( model.velocityVectorVisibilityProperty, velocityArrow );

    // Show/hide the acceleration arrow
    updateArrowVisibility( model.accelerationVectorVisibilityProperty, accelerationArrow );

    // Show/hide the spring force arrow
    updateForceVisibility( model.springVectorVisibilityProperty, springForceArrow );

    // Show/hide the gravity force arrow
    updateForceVisibility( model.gravityVectorVisibilityProperty, gravityForceArrow );

    // Show/hide the net force arrow
    Property.multilink( [ mass.springProperty, model.forcesModeProperty ],
      function( spring, forcesMode ) {
        netForceArrow.visible = !!spring && forcesMode === MassesAndSpringsConstants.FORCES_MODE_CHOICE.NET_FORCES;
      } );

    // Show/hide line at base of vectors
    Property.multilink( [
        mass.springProperty,
        model.gravityVectorVisibilityProperty,
        model.springVectorVisibilityProperty,
        model.forcesModeProperty
      ],
      function( spring, gravityForceVisible, springForceVisible, forcesMode ) {
        forceNullLine.visible = !!spring && ( gravityForceVisible || springForceVisible || forcesMode === MassesAndSpringsConstants.FORCES_MODE_CHOICE.NET_FORCES );
      } );

    /**
     * Updates the arrow by using .setTailAndTip(). Used to make code concise.
     *
     * @param {VectorArrow|ForceVectorArrow} arrow - arrow to be updated
     * @param {Vector2} position
     * @param {number} xOffset
     * @param {number} y2 - number that will be used for y2 value in setTailAndTip()
     */
    const updateArrow = function( arrow, position, xOffset, y2 ) {
      arrow.setTailAndTip(
        self.rect.centerX + xOffset,
        position.y + self.rect.centerY,
        self.rect.centerX + xOffset,
        position.y + self.rect.centerY + y2
      );
    };

    // Links for handling the length of the vectors in response to the system.
    const scalingFactor = 3;
    let xOffset;
    let y2;
    let position;
    Property.multilink( [
      mass.verticalVelocityProperty,
      model.accelerationVectorVisibilityProperty
    ], function( velocity, accelerationVisible ) {
      xOffset = accelerationVisible ? -8 : 0;
      position = mass.positionProperty.get();
      y2 = -ARROW_SIZE_DEFAULT * velocity * scalingFactor;
      updateArrow( velocityArrow, position, xOffset, y2 );
    } );

    // When gravity changes, update the gravitational force arrow
    Property.multilink( [ mass.springProperty, mass.gravityProperty ],
      function( spring, gravity ) {
        const gravitationalAcceleration = mass.mass * gravity;
        position = mass.positionProperty.get();
        xOffset = forcesOrientation * 45;
        y2 = ARROW_SIZE_DEFAULT * gravitationalAcceleration;
        updateArrow( gravityForceArrow, position, xOffset, y2 );
      } );

    // When the spring force changes, update the spring force arrow
    Property.multilink( [ mass.springForceProperty ],
      function( springForce ) {
        position = mass.positionProperty.get();
        xOffset = forcesOrientation * 45;
        y2 = -ARROW_SIZE_DEFAULT * springForce;
        updateArrow( springForceArrow, position, xOffset, y2 );
      } );

    // When net force changes changes, update the net force arrow
    assert && assert( mass.springProperty.get() === null, 'We currently assume that the masses don\'t start attached to the springs' );
    Property.multilink( [
      mass.netForceProperty,
      model.accelerationVectorVisibilityProperty,
      mass.accelerationProperty,
      model.velocityVectorVisibilityProperty
    ], function( netForce, accelerationVisible, netAcceleration, velocityVisible ) {
      position = mass.positionProperty.get();
      if ( Math.abs( netForce ) > 1E-6 ) {
        xOffset = forcesOrientation * 45;
        y2 = -ARROW_SIZE_DEFAULT * netForce;
        updateArrow( netForceArrow, position, xOffset, y2 );
      }
      else {
        netForceArrow.setTailAndTip( 0, 0, 0, 0 );
      }
      if ( Math.abs( netAcceleration ) > 1E-6 ) {
        xOffset = velocityVisible ? 8 : 0;
        y2 = -ARROW_SIZE_DEFAULT * netAcceleration / scalingFactor;
        updateArrow( accelerationArrow, position, xOffset, y2 );
      }
      else {
        accelerationArrow.setTailAndTip( 0, 0, 0, 0 );
      }
    } );

    // When the mass's position changes update the forces baseline marker
    mass.positionProperty.link( function( position ) {
      forceNullLine.setLine(
        self.rect.centerX + forcesOrientation * 40, position.y + self.rect.centerY,
        self.rect.centerX + forcesOrientation * 50, position.y + self.rect.centerY
      );
    } );
  }

  massesAndSprings.register( 'MassNode', MassNode );

  return inherit( Node, MassNode );
} );
