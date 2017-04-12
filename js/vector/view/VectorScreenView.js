// Copyright 2016, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var VectorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vector/view/VectorVisibilityControlPanel' );
  var Property = require( 'AXON/Property' );

  // constants
  // var ARROW_LENGTH = 24;
  var ARROW_HEAD_WIDTH = 14;
  var ARROW_TAIL_WIDTH = 8;
  var ARROW_SIZE_DEFAULT = 25;
  var VELOCITY_ARROW_COLOR = 'rgb( 41, 253, 46 )';
  var ACCELERATION_ARROW_COLOR = 'rgb( 255, 253, 56 )';

  /**
   * @param {VectorModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function VectorScreenView( model, tandem ) {
    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );
    var self = this;

    // TODO: Change this value to the bottom of the vectorVisibilityControlPanel + spacing
    this.toolboxPanel.top = 350;

    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ),
      {
        top: this.gravityControlPanel.bottom + this.topSpacing,
        left: self.secondSpringConstantControlPanel.right + 10,
        maxWidth: 180
      }
    );
    this.addChild( vectorVisibilityControlPanel );

    var velocityArrow = new ArrowNode( 0, 1.25, ARROW_SIZE_DEFAULT - 24, 0, {
      fill: VELOCITY_ARROW_COLOR,
      centerY: 0,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      tandem: tandem.createTandem( 'velocityArrow' )
    } );
    this.addChild( velocityArrow );

    var accelerationArrow = new ArrowNode( 0, 1.25, ARROW_SIZE_DEFAULT - 24, 0, {
      fill: ACCELERATION_ARROW_COLOR,
      centerY: 0,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      tandem: tandem.createTandem( 'accelerationArrow' )
    } );
    this.addChild( accelerationArrow );

    // MultiLink handling the visibility of vectors
    // TODO: Ask Sam about having a multilink instead of multiple links despite not having interdependence
    Property.multilink( [ model.velocityVectorVisibilityProperty, model.accelerationVectorVisibilityProperty ],
      function( velocityVectorVisibility, accelerationVectorVisibility ) {
        velocityArrow.visible = velocityVectorVisibility;
        accelerationArrow.visible = accelerationVectorVisibility;
      } );

    // Link for velocity vector position and length
    model.spring1MassAttachedProperty.link( function( massAttachedProperty ) {
      if ( massAttachedProperty ) {
        massAttachedProperty.verticalVelocityProperty.link( function( massVelocity ) {
          if ( massAttachedProperty !== null ) {
            var position = self.modelViewTransform2.modelToViewPosition( massAttachedProperty.positionProperty.get() );
            velocityArrow.setTailAndTip( position.x - 10,
              position.y + 50,
              position.x - 10,
              position.y + 50 - ARROW_SIZE_DEFAULT * massVelocity * 3
            );
          }
        } );
      }
    } );

    // Link for acceleration vector position and length
    model.spring1MassAttachedProperty.link( function( massAttachedProperty ) {
      if ( massAttachedProperty ) {
        massAttachedProperty.verticalVelocityProperty.link( function() {
          if ( massAttachedProperty !== null ) {
            var position = self.modelViewTransform2.modelToViewPosition( massAttachedProperty.positionProperty.get() );
            accelerationArrow.setTailAndTip( position.x + 10,
              position.y + 50,
              position.x + 10,
              position.y + 50 + ARROW_SIZE_DEFAULT
            );
          }
        } );
      }
    } );
  }

  massesAndSprings.register( 'VectorScreenView', VectorScreenView );

  return inherit( TwoSpringView, VectorScreenView );
} );